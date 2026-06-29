async function loadStartups() {
    const res = await fetch("http://localhost:5000/api/startups/all");
    const data = await res.json();

    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    data.forEach(startup => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${startup.title}</h3>
            <p>${startup.domain}</p>
            <p>${startup.required_skills}</p>
            <button onclick="applyStartup(${startup.id})">Apply</button>
        `;

        grid.appendChild(card);
    });
}

loadStartups();