const startupContainer = document.getElementById("startupContainer");

async function loadStartups() {
    try {
        const res = await fetch(
            "http://localhost:5000/api/startups/all"
        );

        const startups = await res.json();

        startupContainer.innerHTML = "";

        startups.forEach(startup => {

            const card = document.createElement("div");

            card.classList.add("card");

            card.innerHTML = `
                <h3>${startup.title}</h3>

                <p>
                    <strong>Domain:</strong>
                    ${startup.domain}
                </p>

                <p>
                    ${startup.description}
                </p>

                <p>
                    <strong>Skills:</strong>
                    ${startup.required_skills}
                </p>

                <button
                    onclick="applyStartup(${startup.id})"
                >
                    Apply
                </button>
            `;

            startupContainer.appendChild(card);
        });

    } catch (error) {
        console.log(error);
    }
}

async function applyStartup(startupId) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {

        const res = await fetch(
            "http://localhost:5000/api/applications/apply",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    startup_id: startupId,
                    applicant_id: user.id
                })
            }
        );

        const data = await res.json();

        alert(data.message);

    } catch (error) {
        console.log(error);
    }
}

loadStartups();