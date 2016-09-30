(function() {
  'use strict';

  var moment = require('moment');

  module.exports = {
    searchQuery: function(searchTerm) {
      var query = { $or: [] };

      if (!Object.keys(searchTerm).length || searchTerm.offset ||
        searchTerm.limit) {
        return {};
      }

      if (searchTerm.role) {
        query.$or.push({ role: searchTerm.role });
      }

      if (searchTerm.q) {
        var searchRegEx = new RegExp(searchTerm.q, 'i');
        query.$or.push({ title: searchRegEx }, { content: searchRegEx });
      }

      if (searchTerm.date) {
        var date = moment(searchTerm.date).toISOString(),
          nextDay = moment(searchTerm.date).add(1, 'd').toISOString();

        query.$or.push({ createdAt: { $gt: date, $lt: nextDay } }, { updatedAt: { $gt: date, $lt: nextDay } });
      }


      return query;
    }
  };
})();
