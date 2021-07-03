import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import instance from './axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original"

function Row({ title, fetchURL, isLarge }) {
    // console.log(instance)

    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(`https://api.themoviedb.org/3${fetchURL}`)
            console.log(request.data.results)
            setMovies(request.data.results)
            return request;
        }
        fetchData()
    }, [fetchURL]) // if [], run once when the row loads, and dont run it again, if [movies], run everytime movies changes

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("")
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'))
                })
                .catch(error => console.log(error))
        }
    }


    return (
        <div className='row'>
            {/*title*/}
            <h2>{title}</h2>
            <div className='row_posters'>
                {/*several row posters*/}
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLarge && "row_posterLarge"}`}
                        src={`${base_url}${isLarge ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>
            {/*container -> poster*/}
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
