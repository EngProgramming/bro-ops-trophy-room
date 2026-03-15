// Data loading
async function loadGameData() {
  const response = await fetch("data/games.json");
  if (!response.ok) {
    throw new Error("Could not load games data.");
  }
  return response.json();
}

// Stats calculation
function calculateStats(data) {
  const completed = data.completed_games;
  const planned = data.to_play_games;

  const totalCompleted = completed.length;
  const totalPlanned = planned.length;

  const completedHours = completed.reduce((sum, item) => sum + Number(item.total_playtime_hours || 0), 0);
  const plannedHours = planned.reduce((sum, item) => sum + Number(item.estimated_playtime_hours || 0), 0);
  const totalCombinedHours = completedHours + plannedHours;

  const completedPlatforms = new Set(completed.map((item) => item.platform));
  const plannedPlatforms = new Set(planned.map((item) => item.target_platform));
  const platformCount = new Set([...completedPlatforms, ...plannedPlatforms]).size;

  const averageRating =
    totalCompleted > 0
      ? (completed.reduce((sum, item) => sum + Number(item.rating || 0), 0) / totalCompleted).toFixed(1)
      : "N/A";

  const yearTotals = completed.reduce((acc, item) => {
    const year = item.finish_date ? String(item.finish_date).slice(0, 4) : "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const yearByYear = Object.entries(yearTotals)
    .map(([year, count]) => `${year}: ${count}`)
    .join(" • ");

  return {
    totalCompleted,
    totalPlanned,
    totalCombinedHours,
    platformCount,
    averageRating,
    yearByYear: yearByYear || "No completed runs yet"
  };
}

function renderStats(stats) {
  const statGrid = document.getElementById("stats-grid");
  const items = [
    { label: "Completed games", value: stats.totalCompleted },
    { label: "Planned games", value: stats.totalPlanned },
    { label: "Combined hours", value: `${stats.totalCombinedHours}h` },
    { label: "Platforms", value: stats.platformCount },
    { label: "Average rating", value: stats.averageRating },
    { label: "Year-by-year", value: stats.yearByYear }
  ];

  statGrid.innerHTML = items
    .map(
      (item) => `
      <article class="stat-card">
        <p class="stat-label">${item.label}</p>
        <p class="stat-value">${item.value}</p>
      </article>
    `
    )
    .join("");

  document.getElementById("hero-callouts").innerHTML = `
    <span class="callout-pill">${stats.totalCompleted} completed run</span>
    <span class="callout-pill">${stats.totalPlanned} game queued</span>
  `;
}

// Filter/sort scaffolding helpers
function uniqueValues(collection, field) {
  return [...new Set(collection.flatMap((item) => item[field] || []))].sort((a, b) => a.localeCompare(b));
}

function uniqueSingleValues(collection, field) {
  return [...new Set(collection.map((item) => item[field]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function populateSelect(id, values, placeholder) {
  const select = document.getElementById(id);
  const optionMarkup = values.map((value) => `<option value="${value.toLowerCase()}">${value}</option>`).join("");
  select.innerHTML = `<option value="all">${placeholder}</option>${optionMarkup}`;
}

function setUpFilterScaffolding(data) {
  populateSelect("completed-genre", uniqueSingleValues(data.completed_games, "genre"), "All genres");
  populateSelect("completed-tag", uniqueValues(data.completed_games, "tags"), "All tags");

  populateSelect("planned-genre", uniqueSingleValues(data.to_play_games, "genre"), "All genres");
  populateSelect("planned-tag", uniqueValues(data.to_play_games, "tags"), "All tags");
}

function sortByTitle(games, direction) {
  return [...games].sort((a, b) => {
    const result = a.title.localeCompare(b.title);
    return direction === "alpha-desc" ? -result : result;
  });
}

function applyCompletedFilters(games) {
  const genre = document.getElementById("completed-genre").value;
  const tag = document.getElementById("completed-tag").value;
  const playtime = document.getElementById("completed-playtime").value;
  const rating = document.getElementById("completed-rating").value;
  const sort = document.getElementById("completed-sort").value;

  let filtered = [...games];

  if (genre !== "all") filtered = filtered.filter((game) => game.genre.toLowerCase() === genre);
  if (tag !== "all") filtered = filtered.filter((game) => game.tags.map((t) => t.toLowerCase()).includes(tag));

  if (playtime === "short") filtered = filtered.filter((game) => game.total_playtime_hours < 20);
  if (playtime === "medium") filtered = filtered.filter((game) => game.total_playtime_hours >= 20 && game.total_playtime_hours <= 50);
  if (playtime === "long") filtered = filtered.filter((game) => game.total_playtime_hours > 50);

  if (rating !== "all") filtered = filtered.filter((game) => game.rating >= Number(rating));

  return sortByTitle(filtered, sort);
}

function applyPlannedFilters(games) {
  const genre = document.getElementById("planned-genre").value;
  const tag = document.getElementById("planned-tag").value;
  const playtime = document.getElementById("planned-playtime").value;
  const priority = document.getElementById("planned-priority").value;
  const sort = document.getElementById("planned-sort").value;

  let filtered = [...games];

  if (genre !== "all") filtered = filtered.filter((game) => game.genre.toLowerCase() === genre);
  if (tag !== "all") filtered = filtered.filter((game) => game.tags.map((t) => t.toLowerCase()).includes(tag));

  if (playtime === "short") filtered = filtered.filter((game) => game.estimated_playtime_hours < 20);
  if (playtime === "medium") filtered = filtered.filter(
    (game) => game.estimated_playtime_hours >= 20 && game.estimated_playtime_hours <= 50
  );
  if (playtime === "long") filtered = filtered.filter((game) => game.estimated_playtime_hours > 50);

  if (priority !== "all") filtered = filtered.filter((game) => game.priority.toLowerCase() === priority);

  return sortByTitle(filtered, sort);
}

// Rendering
function tagMarkup(tags) {
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderCompletedGames(games) {
  const grid = document.getElementById("completed-grid");
  grid.innerHTML = games
    .map(
      (game) => `
      <button class="game-card" data-card-type="completed" data-id="${game.id}">
        <div class="cover-wrap">
          <img src="${game.cover_image}" alt="${game.title} cover art" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-title-row">
            <h3>${game.title}</h3>
            <span class="rating-chip">★ ${game.rating}</span>
          </div>
          <div class="card-meta">
            <span>${game.platform}</span>
            <span>Finished ${game.finish_date}</span>
            <span>${game.total_playtime_hours}h logged</span>
          </div>
          <div class="tags">${tagMarkup(game.tags)}</div>
        </div>
      </button>
    `
    )
    .join("");
}

function renderPlannedGames(games) {
  const grid = document.getElementById("planned-grid");
  grid.innerHTML = games
    .map(
      (game) => `
      <button class="game-card" data-card-type="planned" data-id="${game.id}">
        <div class="cover-wrap">
          <img src="${game.cover_image}" alt="${game.title} cover art" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-title-row">
            <h3>${game.title}</h3>
            <span class="priority-chip">${game.priority} priority</span>
          </div>
          <div class="card-meta">
            <span>${game.target_platform}</span>
            <span>Estimated ${game.estimated_playtime_hours}h</span>
            <span>Status: ${game.backlog_status}</span>
          </div>
          <div class="tags">${tagMarkup(game.tags)}</div>
        </div>
      </button>
    `
    )
    .join("");
}

// Modal behavior
const modal = document.getElementById("game-modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
let lastFocusedElement = null;

function openModal(htmlContent) {
  lastFocusedElement = document.activeElement;
  modalBody.innerHTML = htmlContent;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function completedModalMarkup(game) {
  return `
    <h3 id="modal-title" class="modal-title">${game.title}</h3>
    <p class="modal-subtitle">${game.platform} • ${game.genre}</p>
    <div class="modal-grid">
      <div class="modal-field"><h4>Start date</h4><p>${game.start_date}</p></div>
      <div class="modal-field"><h4>Finish date</h4><p>${game.finish_date}</p></div>
      <div class="modal-field"><h4>Total playtime</h4><p>${game.total_playtime_hours}h</p></div>
      <div class="modal-field"><h4>Completion type</h4><p>${game.completion_type}</p></div>
      <div class="modal-field"><h4>Achievements</h4><p>${game.achievements_completed}/${game.achievements_total}</p></div>
      <div class="modal-field"><h4>Rating</h4><p>${game.rating} / 5</p></div>
      <div class="modal-field"><h4>Notes</h4><p>${game.notes}</p></div>
      <div class="modal-field"><h4>Favorite memory</h4><p>${game.favorite_memory}</p></div>
      <div class="modal-field"><h4>Tags</h4><p>${game.tags.join(", ")}</p></div>
    </div>
  `;
}

function plannedModalMarkup(game) {
  return `
    <h3 id="modal-title" class="modal-title">${game.title}</h3>
    <p class="modal-subtitle">${game.target_platform} • ${game.genre}</p>
    <div class="modal-grid">
      <div class="modal-field"><h4>Estimated playtime</h4><p>${game.estimated_playtime_hours}h</p></div>
      <div class="modal-field"><h4>Priority</h4><p>${game.priority}</p></div>
      <div class="modal-field"><h4>Backlog status</h4><p>${game.backlog_status}</p></div>
      <div class="modal-field"><h4>Reason to play</h4><p>${game.reason_to_play}</p></div>
      <div class="modal-field"><h4>Tags</h4><p>${game.tags.join(", ")}</p></div>
    </div>
  `;
}

function wireEventHandlers(data) {
  const completedControls = [
    "completed-genre",
    "completed-tag",
    "completed-status",
    "completed-playtime",
    "completed-rating",
    "completed-sort"
  ];

  const plannedControls = [
    "planned-genre",
    "planned-tag",
    "planned-status",
    "planned-playtime",
    "planned-priority",
    "planned-sort"
  ];

  completedControls.forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      renderCompletedGames(applyCompletedFilters(data.completed_games));
    });
  });

  plannedControls.forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      renderPlannedGames(applyPlannedFilters(data.to_play_games));
    });
  });

  document.body.addEventListener("click", (event) => {
    const card = event.target.closest(".game-card");
    if (card) {
      const type = card.dataset.cardType;
      const id = card.dataset.id;

      if (type === "completed") {
        const game = data.completed_games.find((item) => item.id === id);
        if (game) openModal(completedModalMarkup(game));
      }

      if (type === "planned") {
        const game = data.to_play_games.find((item) => item.id === id);
        if (game) openModal(plannedModalMarkup(game));
      }
    }

    if (event.target.matches("[data-close-modal='true']")) {
      closeModal();
    }
  });

  modalClose.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

async function initializeSite() {
  try {
    const data = await loadGameData();

    const stats = calculateStats(data);
    renderStats(stats);

    setUpFilterScaffolding(data);
    renderCompletedGames(data.completed_games);
    renderPlannedGames(data.to_play_games);

    wireEventHandlers(data);
  } catch (error) {
    const statsGrid = document.getElementById("stats-grid");
    statsGrid.innerHTML = `<p>Unable to load game data. Please verify data/games.json.</p>`;
    console.error(error);
  }
}

initializeSite();
