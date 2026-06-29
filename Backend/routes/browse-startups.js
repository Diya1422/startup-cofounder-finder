async function loadStartups() {

    const res =
    await fetch(
    "http://localhost:5000/api/startups"
    );

    const startups =
    await res.json();

    const grid =
    document.querySelector(".grid");

    grid.innerHTML = "";

    startups.forEach(startup => {

        grid.innerHTML += `
        <div class="card">

            <h3>${startup.title}</h3>

            <p>${startup.domain}</p>

            <p>${startup.required_skills}</p>

            <button onclick="applyStartup(${startup.id})">
                Apply
            </button>

        </div>
        `;
    });
}

loadStartups();