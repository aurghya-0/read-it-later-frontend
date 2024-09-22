function formatDate(isoDate) {
  console.log(isoDate);
  const date = new Date(isoDate);
  const localeDate = date.toLocaleString("en-in");
  console.log(localeDate);
  return localeDate;
}

