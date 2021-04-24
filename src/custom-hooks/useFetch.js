import { useState } from "react";

export default function useFetch(baseUrl) {
    const [isLoading, setLoading] = useState(false);

    function get(url) {
        setLoading(true);
        return new Promise((resolve, reject) => {
            fetch(baseUrl + url)
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    function post(url, body) {
        setLoading(true);
        return new Promise((resolve, reject) => {
            fetch(baseUrl + url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        setLoading(false);
                        return reject(data);
                    }
                    setLoading(false);
                    resolve(data);
                })
                .catch(error => {
                    setLoading(false);
                    reject(error);
                });
        });
    }

    return { get, post, isLoading };
};