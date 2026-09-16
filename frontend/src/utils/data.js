import male from "../assets/male.jpg";
import female from "../assets/female.jpg";

export const Courses = [
  {
    title: "Frontend: ReactJs",
    description:
      "Frontend development using ReactJS involves building user interfaces and user experiences for web applications using the React library. React allows developers to create reusable UI components, manage state and props, and handle events and updates efficiently. With React, developers can create fast, scalable, and maintainable frontend applications. React enables developers to create dynamic, interactive, and responsive web applications with a high level of customization and control. Its popularity and large community make it a go-to choice for frontend development.",
    cover_image: "/course_banner.jpg",
    price: "₦100,000",
    url: "",
    prerequisite: "Knowledge of HTML, CSS and JavaScript.",
    favourite: true,
  },
  {
    title: "Frontend: HTML, CSS & JS",
    description:
      "Frontend development using HTML, CSS, and JavaScript involves building the user interface and user experience of web applications using these fundamental technologies. HTML (Hypertext Markup Language) is used for structuring and organizing content on the web page. CSS (Cascading Style Sheets) is used for styling, layout, and visual effects, making the web page visually appealing. JavaScript is used for adding interactivity, dynamic effects, and functionality to the web page, making it responsive and engaging. Together, these technologies enable developers to create static and dynamic web pages, web applications, and mobile applications, forming the backbone of frontend development. Mastering HTML, CSS, and JavaScript is essential for building modern web applications and providing a solid foundation for frontend development.",
    cover_image: "/course_banner.jpg",
    price: "₦70,000",
    url: "",
    prerequisite: "Knowledge of basic computer usage.",
    favourite: false,
  },
  {
    title: "Backend: NodeJs",
    description:
      "Backend development using Node.js involves building server-side logic, database integration, and API connectivity for web applications using the Node.js runtime environment. Node.js allows developers to write JavaScript on the server-side, making it a popular choice for real-time web applications. Node.js offers a fast, scalable, and flexible platform for building backend applications, enabling developers to create high-performance servers, APIs, and web services. Its event-driven, non-blocking I/O model makes it ideal for real-time web applications, and its large ecosystem of packages and modules simplifies development.",
    cover_image: "/course_banner.jpg",
    price: "₦130,000",
    url: "",
    prerequisite: "Knowledge of JavaScript.",
    favourite: true,
  },
  {
    title: "Backend: Django",
    description:
      "Backend development using Django involves building robust, scalable, and maintainable web applications using the Django framework. Django provides a high-level Python web framework that enables rapid development and clean, pragmatic design. Django's batteries-included approach provides a comprehensive set of tools and libraries, making it an ideal choice for building complex and scalable web applications quickly and efficiently. Its strong emphasis on reusability, modularity, and maintainability ensures that applications built with Django are robust and long-lasting.",
    cover_image: "/course_banner.jpg",
    price: "₦150,000",
    url: "",
    prerequisite: "Knowledge of basic python scripting.",
    favourite: true,
  },
  {
    title: "Robotics: Embedded System",
    description:
      "Embedded systems in robotics are purpose-built computing platforms designed to accomplish specific software-controlled tasks ¹. They play a crucial role in enabling robots to perform complex tasks with precision and efficiency ². Key aspects of embedded systems in robotics include: Microprocessors or microcontrollers to program robots for specific purposes, Sensors to collect data from the environment, Communication between sensors and mechanical devices to facilitate interaction, Compliance with industry standards and regulations for safety and reliability, Real-time processing and analysis of data for adaptive and intelligent behavior, etc.",
    cover_image: "/course_banner.jpg",
    price: "₦150,000",
    url: "",
    prerequisite: "No prior knowledge needed.",
    favourite: true,
  },
  {
    title: "Cyber Security",
    description:
      "Cyber security refers to the practices, technologies, and processes designed to protect digital information, networks, and systems from unauthorized access, use, disclosure, disruption, modification, or destruction. This includes protection against malware, viruses, hacking, phishing, and other types of cyber threats. Effective cyber security measures enable organizations and individuals to safeguard their sensitive data, maintain confidentiality, integrity, and availability, and ensure business continuity. Key aspects of cyber security include: Network security, Application security, Data security, Endpoint security, etc. In today's interconnected world, cyber security is crucial for protecting against financial loss, reputational damage, and potential physical harm.",
    cover_image: "/course_banner.jpg",
    price: "₦200,000",
    url: "",
    prerequisite: "Knowledge of basic computer skills.",
    favourite: true,
  },
  {
    title: "Data Science",
    description:
      "Data science is the extraction of insights and knowledge from data using various techniques, tools, and methods. Data science combines elements of computer science, statistics, and domain expertise. The goal of data science is to turn data into actionable knowledge that drives business value and informs strategic decisions.",
    cover_image: "/course_banner.jpg",
    price: "₦150,000",
    url: "",
    prerequisite: "Knowledge of basic computer skills.",
    favourite: false,
  },
  {
    title: "Data Analysis",
    description:
      "Data analysis is the process of extracting insights and meaningful patterns from data to support decision-making, problem-solving, and business improvement. The goal of data analysis is to turn data into actionable knowledge that drives business value and improvement.",
    cover_image: "/course_banner.jpg",
    price: "₦120,000",
    url: "",
    prerequisite: "Knowledge of basic computer skills.",
    favourite: true,
  },
  {
    title: "Cloud Engineering",
    description:
      "Cloud engineering is the design, development, deployment, and management of cloud-based systems and applications. It involves: Architecting and building scalable, secure, and efficient cloud infrastructure, Migrating and deploying applications to cloud platforms (e.g., AWS, Azure, Google Cloud), Ensuring high availability, scalability, performance and more. Cloud engineers use various tools and technologies, such as containerization (e.g., Docker), serverless computing (e.g., Lambda), and cloud management platforms (e.g., Terraform), to design and operate cloud-based systems that meet business requirements and drive digital transformation.",
    cover_image: "/course_banner.jpg",
    price: "₦200,000",
    url: "",
    prerequisite: "Knowledge of basic computer skills.",
    favourite: true,
  },
];

export const Testimonials = [
  {
    name: "Lomolink",
    summary:
      "I've worked with several companies in the past, but none have delivered the level of service and expertise that this company has.",
    cover_image: male,
    rating: 5,
  },
  {
    name: "Sparklewise",
    summary:
      "I was blown away by the quality of service I received from this company. They truly exceeded my expectations!",
    cover_image: female,
    rating: 5,
  },
  {
    name: "WAO",
    summary:
      "I was impressed by the company's attention to detail and commitment to delivering high-quality results.",
    cover_image: male,
    rating: 5,
  },
];
