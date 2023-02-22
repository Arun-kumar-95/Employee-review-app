// exporting the error formatter function
module.exports.errorFormatter = (e) => {
//   let error array ro be empty
  let errors = [];
// separating th error from  ":"  
  const allErrors = e.substring(e.indexOf(":") + 1).trim();
  // separating th error msg from  ","  
  const allErrorsInArrayFormat = allErrors.split(",").map((err) => err.trim());

// applying for each to error   
  allErrorsInArrayFormat.forEach((err) => {
    const [key, value] = err.split(":").map((err) => err.trim());
    errors.push(value);
  });

//   return the error
  return errors;
};
