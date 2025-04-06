export const formatTitleCase = (input) => {
  return input
    .split(/\n|,/g) // split by new lines or commas if needed
    .flatMap((line) => line.split(" ")) // handle phrases like 'mental health'
    .map((word) => word.trim().charAt(0).toUpperCase() + word.trim().slice(1).toLowerCase())
    .join(" ")
    .replace(/\s+/g, " ") // remove extra spaces
    .replace(/ ([A-Z])/g, "\n$1"); // insert line break before capital letters (after first word)
};
