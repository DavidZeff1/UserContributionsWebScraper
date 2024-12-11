(async () => {
    const userLinks = Array.from(document.querySelectorAll("a.mw-userlink")).map((link) => ({
      username: link.textContent.trim(),
      userLink: link.href,
    }));
  
    const userContributionsMap = {};
  
    for (const { username, userLink } of userLinks) {
      if (!userContributionsMap[username]) {
        const response = await fetch(userLink);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
  
        const contributions = Array.from(
          doc.querySelectorAll(".div-col ul li > a, .div-col ul li > i > a ul > li a")
        ).map((item) => item.textContent.trim());
  
        userContributionsMap[username] = contributions;
      }
    }
  
    console.log(userContributionsMap);
  
    // Convert data to CSV and download
    const csvContent = Object.entries(userContributionsMap)
      .map(([user, contributions]) => `${user},${contributions.join(";")}`)
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_contributions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })();
  