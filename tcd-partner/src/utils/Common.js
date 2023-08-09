export const setPageTitle = (pageTitle) => {
  document.title = `The Cannabis Diary - Partner's Portal - ${pageTitle}`;
};
export const starAveRatings = (averageRating) => {
  var starAveRatings = '';
  var averageRatings = (averageRating) ? averageRating : 0;
  for (var w = 0; w <= 4; w++) {
    if (averageRatings <= w ) {
      starAveRatings += '<span class="star"><img src="/assets/images/icons/star-black.svg" alt="'+averageRatings+'" /> </span>'
    } else {
      starAveRatings += '<span class="star"><img src="/assets/images/icons/star.svg" alt="" /> </span>'
    }
  }
  return starAveRatings;
}

export const dateRange = () => {
  const dateRangeResult = [
    { value: 6, month: "6 months" },
    { value: 1, month: "This month" },
    { value: 2, month: "Show Last 30 days" },
    { value: 4, month: "Last month" },
    { value: 5, month: "3 months" },
    { value: 0, month: "Date Range" },
    ];
  return dateRangeResult;
}

export const dateMonths = (monthToShow, dateTo) => {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var today = !!dateTo ? new Date(dateTo): new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var months = [];
  var i = 0;
  do {
      if (month < 0) {
          month = 11;
          year--;
      }
      var monthYearName = monthNames[month] + " " + year
      months.push({ [monthYearName]: []});
      month--;
      i++;
  } while (i < monthToShow);
  return months;
}