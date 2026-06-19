// Build a friendly, human readable download filename from an advice item, for
// example "better-dev-advice-by-kent-beck". Falls back to the id if the author
// slug comes out empty.
export function adviceFileName(item) {
  if (!item) return 'better-dev-advice';
  const slug = String(item.author || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `better-dev-advice-by-${slug}` : `better-dev-advice-${item.id}`;
}
