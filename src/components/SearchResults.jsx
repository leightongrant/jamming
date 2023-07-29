import { useState, useEffect, useRef } from 'react';

function SearchResults({ search }) {
    const [params, setParams] = useState(
        new URLSearchParams(window.location.search)
    );
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('token') || ''
    );
    const [tracks, setTracks] = useState([]);
    const [tokenRequest, setTokenRequest] = useState(false);
    const clientId = import.meta.env.VITE_APP_ID;

    useEffect(() => {
        console.log('redirecting');
        if (!accessToken || accessToken === 'undefined') {
            if (params.size < 1 || tokenRequest) {
                console.log('...Redirecting');
                redirectToAuthCodeFlow(clientId);
            }
        }
    }, [tokenRequest]);

    useEffect(() => {
        console.log('checking token');
        checkToken();
    }, [search]);

    useEffect(() => {
        console.log('getting token');
        if (params.size > 0 && !accessToken) {
            const code = params.get('code');
            getAccessToken(clientId, code);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            console.log('...getting tracks');
            setTokenRequest(!tokenRequest);
            search && setTracks(getTracks(accessToken, search));
        }
    }, [accessToken, search]);

    function checkToken() {
        console.log(!localStorage.getItem('token'));
        console.log(params.size > 1);

        if (!localStorage.getItem('token') && params.size > 0) {
            setTokenRequest(!tokenRequest);
        }

        if (localStorage.getItem('token')) {
            const timeCreated = localStorage.getItem('timeTokenCreated');
            const now = new Date().getTime();
            const minutesPassed = Math.round((now - timeCreated) / 60000);
            if (minutesPassed > 2) {
                localStorage.setItem('token', '');
                setAccessToken('');
            }

            console.log('Minutes Passed: ', minutesPassed);
        }
    }

    // // Redirect function
    async function redirectToAuthCodeFlow(clientId) {
        const verifier = generateCodeVerifier(128);

        localStorage.setItem('verifier', verifier);

        const challenge = await generateCodeChallenge(verifier);

        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('response_type', 'code');
        params.append('redirect_uri', 'http://localhost:5173/callback');
        params.append('scope', 'user-read-private user-read-email');
        params.append('code_challenge_method', 'S256');
        params.append('code_challenge', challenge);

        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;

        setParams(new URLSearchParams(window.location.search));
    }

    // // Verifier function
    function generateCodeVerifier(length) {
        let text = '';
        let possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }
        return text;
    }

    // // Challenge function
    async function generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(
            String.fromCharCode.apply(null, [...new Uint8Array(digest)])
        )
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    // // Access Token Function
    async function getAccessToken(clientId, code) {
        const verifier = localStorage.getItem('verifier');
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', 'http://localhost:5173/callback');
        params.append('code_verifier', verifier);

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });

        const { access_token } = await result.json();
        access_token && localStorage.setItem('token', access_token);
        access_token && setAccessToken(access_token);
        access_token &&
            localStorage.setItem('timeTokenCreated', new Date().getTime());
        return access_token;
    }

    async function getTracks(token, url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                const dataArray = await data.tracks.items;
                const results = dataArray.map((i, idx) => {
                    return (
                        <div key={i.name + '_' + idx} className='tracks'>
                            <h5>Track Name: {`${i.name}`}</h5>
                            <p>Album Name: {i.album.name}</p>
                        </div>
                    );
                });
                const trackResults = await results;

                setTracks(trackResults);
            } else {
                console.log(response.status);
            }
        } catch {
            (e) => console.log(e);
        }
    }

    return <>{tracks.length > 0 && tracks}</>;
}

export default SearchResults;
