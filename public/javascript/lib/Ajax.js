
function constructErrorHtml(error) {
    const errorMessage = document.createElement("div");
    const errorHead = document.createElement("h2");
    const errorBody = document.createElement("p");

    errorHead.innerHTML = "Došlo je do greške";
    errorBody.innerHTML = error.message;
    errorMessage.appendChild(errorHead);
    errorMessage.appendChild(errorBody);

    return errorMessage;
}

//const errorHtml = constructErrorHtml(error);
//document.body.appendChild(errorHtml);

function getJson(endpoint) {
    return fetch(endpoint)
        .then(response => response.json())
        .catch(constructErrorHtml);
}

/*
possibly also:

fetch(endpoint,
{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(json)
})
*/

function postJson(endpoint, json) {
    var data = new FormData();
    data.append("json", JSON.stringify(json));

    return fetch(endpoint, {
            method: "POST",
            body: data
        }).then(response => response.json())
          .catch(constructErrorHtml);
}
