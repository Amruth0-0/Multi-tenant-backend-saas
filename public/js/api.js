function getToken(){
    return localStorage.getItem("token")
}

async function callApi(url, method, data){
    let response;

    if(data){
        response = await fetch("/api" + url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },
            body: JSON.stringify(data)
        });
    }
    else{
        response = await fetch("/api" + url, {
            method: method,
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });
    }

    const result = await response.json();
    if(!response.ok){
        alert(result.message || "Something went wrong");
    }

    return result;
    }
