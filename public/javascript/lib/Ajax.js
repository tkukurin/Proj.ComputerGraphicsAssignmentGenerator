
function constructErrorHtml(error) {
    const errorMessage = document.createElement("div");
    const errorHead = document.createElement("h2");
    const errorBody = document.createElement("p");

    errorHead.innerHTML = "Došlo je do greške (" + error.status + ")";
    errorBody.innerHTML = error.message;
    errorMessage.appendChild(errorHead);
    errorMessage.appendChild(errorBody);

    return errorMessage;
}

function jsonOrThrow(response) {
    if (response.ok) 
        return response.json();

    throw { status: response.status || "nepoznat status", 
            message: response.statusText || "Nešto je pošlo po zlu" };
}

function getJson(endpoint) {
    return fetch(endpoint).then(jsonOrThrow);
}

function jsonHeaders() {
    return { 'Accept': 'application/json',
             'Content-Type': 'application/json' };
}

function postJson(endpoint, json) {
    //var data = new FormData();
    //data.append("json", JSON.stringify(json));

    return fetch(endpoint, {
            headers: jsonHeaders(),
            method: "POST",
            body: JSON.stringify(json)
        }).then(jsonOrThrow);
}
