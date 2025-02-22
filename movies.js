document.addEventListener("DOMContentLoaded", function () {
  fetch("uploads/media.json")
      .then(response => response.json())
      .then(data => {
          let moviesContainer = document.getElementById("moviesContainer");
          let queueContainer = document.getElementById("queueContainer");

          data.filter(item => item.category === "Movie").forEach(movie => {
              let movieCard = `
                  <div class="movie-card">
                      <div class="movie-poster-wrapper">
                          <video width="200" controls>
                              <source src="${movie.file}" type="video/mp4">
                          </video>
                      </div>
                      <div class="movie-info">
                          <h3>${movie.title}</h3>
                          <p>${movie.genre}</p>
                      </div>
                  </div>`;
              moviesContainer.innerHTML += movieCard;
              queueContainer.innerHTML += movieCard;
          });
      })
      .catch(error => console.error("Error loading movies:", error));
});
