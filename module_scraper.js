const view = document.querySelector("#main-content-inner");
view.scrollTo(0, view.scrollHeight);

setTimeout(() => {
  const elements = document.getElementsByClassName("js-course-title-element");

  const modules = [];

  for (let i = 0; i < elements.length; i++) {
    const rawTitle = elements[i].getAttribute("title");

    const regexPattern = /^(\d+\/\d+)\((\d+)\)\s+([A-Z]{4}\d{4})\s*(.+)\s+\(\d{5}\)$/;

    const matchResult = rawTitle.match(regexPattern);
    if (!matchResult) {
      break;
    }

    const rawYear = matchResult[1];
    let year;

    switch (rawYear) {
      case "23/24":
        year = 1;
        break;
      case "24/25":
        year = 2;
        break;
      case "25/26":
        year = 3;
        break;
      default:
        year = 0;
        break;
    }

    const semester = Number(matchResult[2]);
    const module_code = matchResult[3];
    const course = module_code.substring(0, 4);
    const title = matchResult[4];

    const course_id = elements[i].getAttribute("id").replace("course-name-", "");
    const url = `https://minerva.leeds.ac.uk/ultra/courses/${course_id}/outline`;

    modules.push({
      id: course_id,
      course: course,
      title: title,
      module_code: module_code,
      semester: semester,
      year: year,
      url: url,
    });
  }

  console.log(modules);
}, 3000);
