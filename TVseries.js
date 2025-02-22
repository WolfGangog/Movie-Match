document.addEventListener("DOMContentLoaded", function () {
  fetch("uploads/media.json")
      .then(response => response.json())
      .then(data => {
          let seriesContainer = document.getElementById("tv-series-list");
          let queueContainer = document.getElementById("queueContainer");

          data.filter(item => item.category === "TV Series").forEach(series => {
              let seriesCard = `
                  <div class="tv-series">
                      <video width="300" controls>
                          <source src="${series.file}" type="video/mp4">
                      </video>
                      <div class="video-details">
                          <h2>${series.title}</h2>
                          <p>${series.genre}</p>
                      </div>
                  </div>`;
              seriesContainer.innerHTML += seriesCard;
              queueContainer.innerHTML += seriesCard;
          });
      })
      .catch(error => console.error("Error loading TV series:", error));
});
