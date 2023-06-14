// eslint-disable-next-line require-await
Site.loadPage(async function (site) {

    Site.loading = function loading(show) {
        const submitButton = document.getElementById("submit");
        if (show) {
            document.getElementById("loading").classList.remove("hidden");
            document.getElementById("submitEntry").classList.add("hidden");
            submitButton.setAttribute("disabled", "");
        } else {
            document.getElementById("loading").classList.add("hidden");
            document.getElementById("submitEntry").classList.remove("hidden");
            submitButton.removeAttribute("disabled");
        }
    };

    loadEventListeners();

    function loadEventListeners() {

        function getUrl(string) {
            let url;
            try {
                url = new URL(string);
            } catch {
                return null;
            }
            return url.protocol === "http:" || url.protocol === "https:" ? url : null;
        }

        site.onDelete(ids => {
            const table = document.getElementsByClassName("submissionsTable")[0];
            for (const id of ids) {
                table.querySelector(`tbody tr[data-id="${id}"]`).remove();
            }
        });

        site.onEntry(data => {
            const table = document.getElementsByClassName("submissionsTable")[0];
            const no = document.getElementsByClassName("submissionsTable tbody tr").length + 1;
            const tbody = table.querySelector("tbody");
            const newRow = `
                <tr data-id="${data.id}">
                    <td>${no}</td>
                    <td><u><span>${data.wadName}</span></u></td>
                    <td>${data.wadLevel}</td>
                </tr>
            `;
            tbody.innerHTML += newRow;
        });

        const wadRadios = document.querySelectorAll("#link,#Upload");
        for (const wadRadio of wadRadios) {
            wadRadio.addEventListener("change", evt => {
                const value = evt.target.value;
                const uploadForm = document.getElementById("wadFile");
                const urlForm = document.getElementById("wadUrl");
                if (value === "upload") {
                    site.display(false, uploadForm);
                    site.display(true, urlForm);
                    urlForm.value = "";
                    uploadForm.setAttribute("required", "");
                    urlForm.removeAttribute("required");
                    document.getElementById("wadName").removeAttribute("disabled");
                } else {
                    site.display(true, uploadForm);
                    site.display(false, urlForm);
                    uploadForm.value = "";
                    urlForm.setAttribute("required", "");
                    uploadForm.removeAttribute("required");
                }
            });
        }
        document.getElementById("wadUrl")?.addEventListener("change", async ev => {
            const value = ev.target.value;
            const wadNameInput = document.getElementById("wadName");
            if (!value) {
                wadNameInput.removeAttribute("disabled");
                wadNameInput.value = "";
            }
            const url = getUrl(value);
            if (!url) {
                return;
            }
            if (!(url.hostname.includes("doomworld.com") && url.pathname.includes("idgames"))) {
                return;
            }
            site.loading(true);
            wadNameInput.setAttribute("placeholder", "Attempting to obtain name from url...");
            wadNameInput.setAttribute("disabled", "true");
            const proxyURl = new URL(`https://api.codetabs.com/v1/proxy?quest=${url}`);
            let result;
            try {
                result = await fetch(proxyURl);
            } catch {
                site.loading(false);
                return;
            } finally {
                wadNameInput.removeAttribute("placeholder");
                wadNameInput.removeAttribute("disabled");
            }
            if (result.status !== 200) {
                return;
            }
            const htmlText = await result.text();
            const domParser = new DOMParser();
            const doomWorldDOc = domParser.parseFromString(htmlText, "text/html");
            const wadName = doomWorldDOc.getElementsByClassName("filelist")[0]?.querySelector("tbody > tr > td:nth-child(2)")?.textContent?.trim() ?? null;
            if (!wadName) {
                wadNameInput.removeAttribute("disabled");
                wadNameInput.value = "";
                site.loading(false);
                return;
            }
            wadNameInput.setAttribute("disabled", "");
            wadNameInput.value = wadName;
            site.loading(false);
        });
        document.getElementById("gameEngine")?.addEventListener("change", evt => {
            const selectedOption = evt.target.options[evt.target.selectedIndex];
            const selectedValue = selectedOption.dataset.value;
            const gzActionsContainer = document.getElementById("gzActionsContainer");
            if (selectedValue === "GZDoom") {
                site.display(false, gzActionsContainer);
            } else {
                site.display(true, gzActionsContainer);
            }
        });

        const distributableRadios = document.querySelectorAll("#authorYes,#authorNo");
        if (distributableRadios) {
            for (const distributableRadio of distributableRadios) {
                distributableRadio.addEventListener("change", evt => {
                    const value = evt.target.value;
                    const distributableSection = document.getElementById("distributableSection");
                    if (value === "true") {
                        site.display(false, distributableSection);
                    } else {
                        site.display(true, distributableSection);
                    }
                });
            }
        }

        document.getElementById("submit")?.addEventListener("click", async ev => {
            await site.submitEntryForm(ev, "addEntry");
        });
    }
});
