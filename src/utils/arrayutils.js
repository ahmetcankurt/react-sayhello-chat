const sortData = (field, data, dir) => {
  let sortedRecord = [...data];
  if (dir && dir === "desc") {
    sortedRecord = sortedRecord.sort((a, b) => {
      if (typeof b[field] === "number") {
        return b[field] - a[field];
      } else {
        return (b[field] || "").toLowerCase() > (a[field] || "").toLowerCase()
          ? 1
          : -1;
      }
    });
  } else {
    sortedRecord = sortedRecord.sort((a, b) => {
      if (typeof b[field] === "number") {
        return a[field] - b[field];
      } else {
        return (a[field] || "").toLowerCase() > (b[field] || "").toLowerCase()
          ? 1
          : -1;
      }
    });
  }

  return sortedRecord;
};

const groupByFields = (array, f) => {
  /*
    params description :
        f : function which returnf the array of fields 
        e.g. :  (item) => {
            return [itemField1, itemField2];
        }

        array : array of data to group e.g. : [{...}, {...}]       
    */

  var groups = {};
  array.forEach((o) => {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(group => {
    return groups[group];
  });
};

const divideByKey = (field, array) => {
  if (!array || array.length === 0) return [];

  let map = array.reduce((p, c) => {
    if (!c || !c[field]) return p; // null/undefined kontrolü
    
    let char = c[field].charAt(0).toUpperCase();
    p[char] = [].concat(p[char] || [], c);
    return p;
  }, {});

  let result = Object.keys(map).map(k => ({
    letter: k,
    data: map[k],
  }));
  result = sortData("letter", result);
  return result;
};
export { sortData, groupByFields, divideByKey };
