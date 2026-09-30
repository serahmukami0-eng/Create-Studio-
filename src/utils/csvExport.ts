import { CommissionOrder, Currency } from '../types';

/**
 * Escapes a cell value for standard CSV compatibility (RFC 4180)
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers browser download of the full commissions & financial ledger CSV
 */
export function exportCommissionsToCSV(
  commissions: CommissionOrder[],
  currency: Currency
): { success: boolean; rowCount: number; fileName: string } {
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `mukami_studio_commissions_ledger_${today}.csv`;

  // Headers
  const headers = [
    'Order ID',
    'Client Name',
    'Contact (Phone/Email)',
    'Service / Artwork Package',
    'Category',
    'Total Price (KSh)',
    'Total Price (USD)',
    'Deposit Status',
    'Realized Cash Collected (KSh)',
    'Realized Cash Collected (USD)',
    'Pending Balance (KSh)',
    'Pending Balance (USD)',
    'Workflow Stage',
    'Revisions Used',
    'Max Revisions Included',
    'Order Date',
    'Target Deadline',
    'Client Brief / Requirements',
  ];

  let totalKShBooked = 0;
  let totalUSDBooked = 0;
  let totalKShRealized = 0;
  let totalUSDRealized = 0;
  let totalKShPending = 0;
  let totalUSDPending = 0;

  const rows = commissions.map((order) => {
    totalKShBooked += order.priceKSh;
    totalUSDBooked += order.priceUSD;

    let realizedKSh = 0;
    let realizedUSD = 0;
    let pendingKSh = order.priceKSh;
    let pendingUSD = order.priceUSD;

    if (order.depositStatus === 'fully_paid') {
      realizedKSh = order.priceKSh;
      realizedUSD = order.priceUSD;
      pendingKSh = 0;
      pendingUSD = 0;
    } else if (order.depositStatus === 'deposit_paid') {
      realizedKSh = Math.round(order.priceKSh * 0.5);
      realizedUSD = Math.round(order.priceUSD * 0.5);
      pendingKSh = order.priceKSh - realizedKSh;
      pendingUSD = order.priceUSD - realizedUSD;
    }

    totalKShRealized += realizedKSh;
    totalUSDRealized += realizedUSD;
    totalKShPending += pendingKSh;
    totalUSDPending += pendingUSD;

    const readableStage = order.stage.replace('_', ' ').toUpperCase();
    const readableDeposit =
      order.depositStatus === 'fully_paid'
        ? '100% Fully Paid'
        : order.depositStatus === 'deposit_paid'
        ? '50% Deposit Paid'
        : 'Unpaid (Awaiting Deposit)';

    return [
      escapeCSV(order.id),
      escapeCSV(order.clientName),
      escapeCSV(order.clientContact),
      escapeCSV(order.serviceTitle),
      escapeCSV(order.category),
      escapeCSV(order.priceKSh),
      escapeCSV(order.priceUSD),
      escapeCSV(readableDeposit),
      escapeCSV(realizedKSh),
      escapeCSV(realizedUSD),
      escapeCSV(pendingKSh),
      escapeCSV(pendingUSD),
      escapeCSV(readableStage),
      escapeCSV(order.revisionsUsed),
      escapeCSV(order.maxRevisions),
      escapeCSV(order.createdAt || 'N/A'),
      escapeCSV(order.deadline || 'N/A'),
      escapeCSV(order.notes || ''),
    ].join(',');
  });

  // Summary row at the bottom
  const summaryRow = [
    escapeCSV('TOTALS / SUMMARY'),
    escapeCSV(`${commissions.length} Orders`),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(totalKShBooked),
    escapeCSV(totalUSDBooked),
    escapeCSV(''),
    escapeCSV(totalKShRealized),
    escapeCSV(totalUSDRealized),
    escapeCSV(totalKShPending),
    escapeCSV(totalUSDPending),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(''),
    escapeCSV(`Exported on ${new Date().toLocaleString()}`),
  ].join(',');

  const csvContent = [headers.map(escapeCSV).join(','), ...rows, summaryRow].join('\r\n');

  // Trigger browser file download with UTF-8 BOM so Excel opens special characters cleanly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    rowCount: commissions.length,
    fileName,
  };
}

/**
 * Generates monthly breakdown CSV report for financial accounting
 */
export function exportMonthlyReportToCSV(
  commissions: CommissionOrder[],
  currency: Currency
): { success: boolean; fileName: string } {
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `mukami_studio_monthly_financial_report_${today}.csv`;

  const headers = [
    'Month',
    'Category',
    'Orders Count',
    'Total Booked (KSh)',
    'Total Booked (USD)',
    'Realized Cash (KSh)',
    'Realized Cash (USD)',
  ];

  // Group by Month + Category
  const grouping: Record<
    string,
    { count: number; bookedKSh: number; bookedUSD: number; realizedKSh: number; realizedUSD: number }
  > = {};

  commissions.forEach((order) => {
    const month = (order.createdAt || order.deadline || '2026-09').slice(0, 7);
    const key = `${month}__${order.category}`;
    if (!grouping[key]) {
      grouping[key] = { count: 0, bookedKSh: 0, bookedUSD: 0, realizedKSh: 0, realizedUSD: 0 };
    }

    const item = grouping[key];
    item.count += 1;
    item.bookedKSh += order.priceKSh;
    item.bookedUSD += order.priceUSD;

    if (order.depositStatus === 'fully_paid') {
      item.realizedKSh += order.priceKSh;
      item.realizedUSD += order.priceUSD;
    } else if (order.depositStatus === 'deposit_paid') {
      item.realizedKSh += Math.round(order.priceKSh * 0.5);
      item.realizedUSD += Math.round(order.priceUSD * 0.5);
    }
  });

  const rows = Object.keys(grouping)
    .sort()
    .map((key) => {
      const [month, cat] = key.split('__');
      const data = grouping[key];
      return [
        escapeCSV(month),
        escapeCSV(cat),
        escapeCSV(data.count),
        escapeCSV(data.bookedKSh),
        escapeCSV(data.bookedUSD),
        escapeCSV(data.realizedKSh),
        escapeCSV(data.realizedUSD),
      ].join(',');
    });

  const csvContent = [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    fileName,
  };
}
