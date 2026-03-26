// Data loading
async function loadGameData() {
  const response = await fetch("data/games.json");
  if (!response.ok) {
    throw new Error("Could not load games data.");
  }
  return response.json();
}

const ACTIVE_STATES = new Set(["Currently Playing", "In Rotation", "Paused"]);

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isPresent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function coerceNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getCardCoverArt(game) {
  if (isPresent(game.cover_art_landscape)) return game.cover_art_landscape;
  if (isPresent(game.cover_art_portrait)) return game.cover_art_portrait;
  return "";
}

// Schema normalization helpers
function normalizeGame(game) {
  return {
    ...game,
    platform: game.platform || "",
    playtime_hours: coerceNumber(game.playtime_hours),
    rating: coerceNumber(game.rating),
    replayable: typeof game.replayable === "boolean" ? game.replayable : null,
    has_achievements: typeof game.has_achievements === "boolean" ? game.has_achievements : null,
    achievements_completed: coerceNumber(game.achievements_completed),
    achievements_total: coerceNumber(game.achievements_total),
    tags: Array.isArray(game.tags) ? game.tags : [],
    cover_art_landscape: game.cover_art_landscape || "",
    cover_art_portrait: game.cover_art_portrait || ""
  };
}

// Date formatting helpers (supports YYYY, YYYY-MM, YYYY-MM-DD)
function parsePartialDate(rawDate) {
  if (!isPresent(rawDate)) return null;
  const value = String(rawDate).trim();

  if (/^\d{4}$/.test(value)) {
    return { kind: "year", year: Number(value) };
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    if (!Number.isNaN(date.getTime())) {
      return { kind: "month", date };
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (!Number.isNaN(date.getTime())) {
      return { kind: "date", date };
    }
  }

  return { kind: "raw", raw: value };
}

function formatDisplayDate(rawDate) {
  const parsed = parsePartialDate(rawDate);
  if (!parsed) return "Unknown";

  if (parsed.kind === "year") return String(parsed.year);
  if (parsed.kind === "month") {
    return parsed.date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  if (parsed.kind === "date") {
    return parsed.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  }
  return parsed.raw;
}

function formatCompactDate(rawDate) {
  const parsed = parsePartialDate(rawDate);
  if (!parsed) return "Unknown";

  if (parsed.kind === "year") return String(parsed.year);
  if (parsed.kind === "month") {
    return parsed.date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  }
  if (parsed.kind === "date") {
    return parsed.date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  }
  return parsed.raw;
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Stats calculation
function buildPlatformBreakdown(completed, planned) {
  const platformCounts = {};
  [...completed, ...planned].forEach((item) => {
    if (!isPresent(item.platform)) return;
    platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
  });

  return Object.entries(platformCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([platform, count]) => `${platform} (${count})`)
    .join(" • ");
}

function calculateStats(data) {
  const completed = data.completed_games;
  const planned = data.to_play_games;

  const totalCompleted = completed.length;
  const totalPlanned = planned.length;

  const completedHours = completed.reduce((sum, item) => sum + Number(item.playtime_hours || 0), 0);
  const plannedHours = planned.reduce((sum, item) => sum + Number(item.playtime_hours || 0), 0);
  const totalTrackedHours = completedHours + plannedHours;

  const platformBreakdown = buildPlatformBreakdown(completed, planned);

  const ratedCompleted = completed.filter((item) => isPresent(item.rating));
  const averageRating =
    ratedCompleted.length > 0
      ? (ratedCompleted.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratedCompleted.length).toFixed(1)
      : "N/A";

  const yearTotals = completed.reduce((acc, item) => {
    const year = isPresent(item.finish_date) ? String(item.finish_date).slice(0, 4) : "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const yearByYear = Object.entries(yearTotals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, count]) => `${year}: ${count}`)
    .join(" • ");

  return {
    totalCompleted,
    totalPlanned,
    completedHours,
    plannedHours,
    totalTrackedHours,
    platformBreakdown: platformBreakdown || "No platform data yet",
    averageRating,
    yearByYear: yearByYear || "No completed runs yet"
  };
}

function renderStats(stats) {
  const statGrid = document.getElementById("stats-grid");
  const items = [
    { label: "Completed games", value: stats.totalCompleted, featured: true },
    { label: "Planned games", value: stats.totalPlanned, featured: true },
    { label: "Total tracked hours", value: `${stats.totalTrackedHours}h`, featured: true },
    { label: "Average rating", value: stats.averageRating, featured: true },
    { label: "Completed logged hours", value: `${stats.completedHours}h` },
    { label: "Planned estimated hours", value: `${stats.plannedHours}h` },
    { label: "Platforms", value: stats.platformBreakdown, compact: true, detail: true },
    { label: "Year-by-year", value: stats.yearByYear, compact: true, detail: true }
  ];

  statGrid.innerHTML = items
    .map(
      (item) => `
      <article class="stat-card${item.featured ? " stat-card--featured" : ""}${item.detail ? " stat-card--detail" : ""}">
        <p class="stat-label">${item.label}</p>
        <p class="stat-value${item.compact ? " stat-value-compact" : ""}">${item.value}</p>
      </article>
    `
    )
    .join("");

  document.getElementById("hero-callouts").innerHTML = `
    <span class="callout-pill">${pluralize(stats.totalCompleted, "completed run")}</span>
    <span class="callout-pill">${pluralize(stats.totalPlanned, "planned game")}</span>
  `;
}

// Filter/sort scaffolding helpers
function uniqueValues(collection, field) {
  return [...new Set(collection.flatMap((item) => item[field] || []))].sort((a, b) => a.localeCompare(b));
}

function uniqueSingleValues(collection, field) {
  return [...new Set(collection.map((item) => item[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function populateSelect(id, values, placeholder) {
  const select = document.getElementById(id);
  const optionMarkup = values.map((value) => `<option value="${normalizeText(value)}">${value}</option>`).join("");
  select.innerHTML = `<option value="all">${placeholder}</option>${optionMarkup}`;
}

function setUpFilterScaffolding(data) {
  populateSelect("completed-genre", uniqueSingleValues(data.completed_games, "genre"), "All genres");
  populateSelect("completed-tag", uniqueValues(data.completed_games, "tags"), "All tags");
  populateSelect("completed-status", uniqueSingleValues(data.completed_games, "status"), "All status");

  populateSelect("planned-genre", uniqueSingleValues(data.to_play_games, "genre"), "All genres");
  populateSelect("planned-tag", uniqueValues(data.to_play_games, "tags"), "All tags");
  populateSelect("planned-status", uniqueSingleValues(data.to_play_games, "status"), "All status");
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
  const status = document.getElementById("completed-status").value;
  const playtime = document.getElementById("completed-playtime").value;
  const rating = document.getElementById("completed-rating").value;
  const sort = document.getElementById("completed-sort").value;

  let filtered = [...games];

  if (genre !== "all") filtered = filtered.filter((game) => normalizeText(game.genre) === genre);
  if (tag !== "all") filtered = filtered.filter((game) => (game.tags || []).map(normalizeText).includes(tag));
  if (status !== "all") filtered = filtered.filter((game) => normalizeText(game.status) === status);

  if (playtime === "short") filtered = filtered.filter((game) => Number(game.playtime_hours) < 20);
  if (playtime === "medium") {
    filtered = filtered.filter((game) => Number(game.playtime_hours) >= 20 && Number(game.playtime_hours) <= 50);
  }
  if (playtime === "long") filtered = filtered.filter((game) => Number(game.playtime_hours) > 50);

  if (rating !== "all") filtered = filtered.filter((game) => Number(game.rating) >= Number(rating));

  return sortByTitle(filtered, sort);
}

function applyPlannedFilters(games) {
  const genre = document.getElementById("planned-genre").value;
  const tag = document.getElementById("planned-tag").value;
  const status = document.getElementById("planned-status").value;
  const playtime = document.getElementById("planned-playtime").value;
  const priority = document.getElementById("planned-priority").value;
  const sort = document.getElementById("planned-sort").value;

  let filtered = [...games];

  if (genre !== "all") filtered = filtered.filter((game) => normalizeText(game.genre) === genre);
  if (tag !== "all") filtered = filtered.filter((game) => (game.tags || []).map(normalizeText).includes(tag));
  if (status !== "all") filtered = filtered.filter((game) => normalizeText(game.status) === status);

  if (playtime === "short") filtered = filtered.filter((game) => Number(game.playtime_hours) < 20);
  if (playtime === "medium") {
    filtered = filtered.filter((game) => Number(game.playtime_hours) >= 20 && Number(game.playtime_hours) <= 50);
  }
  if (playtime === "long") filtered = filtered.filter((game) => Number(game.playtime_hours) > 50);

  if (priority !== "all") filtered = filtered.filter((game) => normalizeText(game.priority) === priority);

  return sortByTitle(filtered, sort);
}

// Rendering
function tagMarkup(tags, limit) {
  const safeTags = tags || [];
  const visibleTags = typeof limit === "number" ? safeTags.slice(0, limit) : safeTags;
  return visibleTags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function emptyStateMarkup(title, message) {
  return `
    <article class="empty-state" aria-live="polite">
      <h3>${title}</h3>
      <p>${message}</p>
    </article>
  `;
}

function getActiveGames(data) {
  const completedActive = data.completed_games
    .filter((game) => ACTIVE_STATES.has(game.activity_state))
    .map((game) => ({
      ...game,
      sourceType: "completed",
      source: "Completed",
      platformLabel: game.platform || "Platform TBD"
    }));

  const plannedActive = data.to_play_games
    .filter((game) => ACTIVE_STATES.has(game.activity_state))
    .map((game) => ({
      ...game,
      sourceType: "planned",
      source: "To-Play",
      platformLabel: game.platform || "Platform TBD"
    }));

  return [...completedActive, ...plannedActive].sort((a, b) => a.title.localeCompare(b.title));
}

function renderActiveGames(activeGames) {
  const grid = document.getElementById("active-grid");

  if (!activeGames.length) {
    grid.innerHTML = emptyStateMarkup(
      "No active runs right now",
      "Set a game's optional activity_state to Currently Playing, In Rotation, or Paused to pin it here."
    );
    return;
  }

  grid.innerHTML = activeGames
    .map(
      (game) => `
      <button class="active-card" type="button" data-card-type="${game.sourceType}" data-id="${game.id}">
        <div class="active-card-header">
          <h3>${game.title}</h3>
          <span class="active-source-chip">${game.source}</span>
        </div>
        <p class="active-meta">${game.platformLabel} • ${game.genre}</p>
        <p class="active-state">${game.activity_state}</p>
      </button>
    `
    )
    .join("");
}

function renderCompletedGames(games) {
  const grid = document.getElementById("completed-grid");

  if (!games.length) {
    grid.innerHTML = emptyStateMarkup(
      "No completed matches",
      "No completed runs match this filter set yet. Try broadening status, playtime, or rating."
    );
    return;
  }

  grid.innerHTML = games
    .map(
      (game) => `
      <button class="game-card" data-card-type="completed" data-id="${game.id}">
        <div class="cover-wrap">
          <img src="${getCardCoverArt(game)}" alt="${game.title} cover art" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-title-row">
            <h3>${game.title}</h3>
            ${isPresent(game.rating) ? `<span class="rating-chip">★ ${game.rating}</span>` : ""}
          </div>
          <dl class="card-meta">
            <div class="meta-item"><dt>Platform</dt><dd>${game.platform || "Platform TBD"}</dd></div>
            <div class="meta-item"><dt>Finished</dt><dd>${formatCompactDate(game.finish_date)}</dd></div>
            ${isPresent(game.playtime_hours) ? `<div class="meta-item"><dt>Hours</dt><dd>${game.playtime_hours}h</dd></div>` : ""}
          </dl>
          <div class="tags">${tagMarkup(game.tags, 2)}</div>
        </div>
      </button>
    `
    )
    .join("");
}

function renderPlannedGames(games) {
  const grid = document.getElementById("planned-grid");

  if (!games.length) {
    grid.innerHTML = emptyStateMarkup(
      "No planned matches",
      "No planned entries match these filters. Try a different status, priority, or playtime range."
    );
    return;
  }

  grid.innerHTML = games
    .map(
      (game) => `
      <button class="game-card" data-card-type="planned" data-id="${game.id}">
        <div class="cover-wrap">
          <img src="${getCardCoverArt(game)}" alt="${game.title} cover art" loading="lazy" />
        </div>
        <div class="card-content">
          <div class="card-title-row">
            <h3>${game.title}</h3>
            ${isPresent(game.priority) ? `<span class="priority-chip">${game.priority} priority</span>` : ""}
          </div>
          <dl class="card-meta">
            <div class="meta-item"><dt>Platform</dt><dd>${game.platform || "Platform TBD"}</dd></div>
            ${isPresent(game.playtime_hours) ? `<div class="meta-item"><dt>Estimated time</dt><dd>${game.playtime_hours}h</dd></div>` : ""}
            <div class="meta-item"><dt>Status</dt><dd>${game.status || "—"}</dd></div>
          </dl>
          <div class="tags">${tagMarkup(game.tags, 3)}</div>
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

function getFocusableModalElements() {
  if (modal.classList.contains("hidden")) {
    return [];
  }

  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ];

  return [...modal.querySelectorAll(focusableSelectors.join(","))].filter(
    (element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden")
  );
}

function trapModalFocus(event) {
  if (event.key !== "Tab" || modal.classList.contains("hidden")) {
    return;
  }

  const focusableElements = getFocusableModalElements();
  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

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

function modalFieldMarkup(label, value, formatter) {
  if (!isPresent(value)) {
    return "";
  }
  const displayValue = formatter ? formatter(value) : value;
  if (!isPresent(displayValue)) {
    return "";
  }
  return `<div class="modal-field"><h4>${label}</h4><p>${displayValue}</p></div>`;
}

function completedModalMarkup(game) {
  const achievementMarkup =
    game.has_achievements === true && isPresent(game.achievements_completed) && isPresent(game.achievements_total)
      ? `<div class="modal-field"><h4>Achievements</h4><p>${game.achievements_completed}/${game.achievements_total}</p></div>`
      : "";

  return `
    <h3 id="modal-title" class="modal-title">${game.title}</h3>
    <p class="modal-subtitle">${[game.platform, game.genre].filter(isPresent).join(" • ")}</p>
    <div class="modal-grid">
      ${modalFieldMarkup("Status", game.status)}
      ${modalFieldMarkup("Activity", game.activity_state)}
      ${modalFieldMarkup("Start date", game.start_date, formatDisplayDate)}
      ${modalFieldMarkup("Finish date", game.finish_date, formatDisplayDate)}
      ${modalFieldMarkup("Total playtime", game.playtime_hours, (hours) => `${hours}h`)}
      ${modalFieldMarkup("Completion type", game.completion_type)}
      ${modalFieldMarkup("DLC status", game.dlc_status)}
      ${achievementMarkup}
      ${modalFieldMarkup("Rating", game.rating, (rating) => `${rating} / 5`)}
      ${modalFieldMarkup("Replayable", game.replayable, (value) => (value ? "Yes" : "No"))}
      ${modalFieldMarkup("Notes", game.notes)}
      ${modalFieldMarkup("Favorite memory", game.favorite_memory)}
      ${modalFieldMarkup("Tags", game.tags, (tags) => tags.join(", "))}
    </div>
  `;
}

function plannedModalMarkup(game) {
  return `
    <h3 id="modal-title" class="modal-title">${game.title}</h3>
    <p class="modal-subtitle">${[game.platform, game.genre].filter(isPresent).join(" • ")}</p>
    <div class="modal-grid">
      ${modalFieldMarkup("Status", game.status)}
      ${modalFieldMarkup("Activity", game.activity_state)}
      ${modalFieldMarkup("Priority", game.priority)}
      ${modalFieldMarkup("Estimated playtime", game.playtime_hours, (hours) => `${hours}h`)}
      ${modalFieldMarkup("Replayable", game.replayable, (value) => (value ? "Yes" : "No"))}
      ${modalFieldMarkup("Reason to play", game.reason_to_play)}
      ${modalFieldMarkup("Notes", game.notes)}
      ${modalFieldMarkup("Tags", game.tags, (tags) => tags.join(", "))}
    </div>
  `;
}

function wireEventHandlers(data) {
  const completedControls = ["completed-genre", "completed-tag", "completed-status", "completed-playtime", "completed-rating", "completed-sort"];

  const plannedControls = ["planned-genre", "planned-tag", "planned-status", "planned-playtime", "planned-priority", "planned-sort"];

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
    const card = event.target.closest(".game-card, .active-card");
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
      return;
    }

    trapModalFocus(event);
  });
}

async function initializeSite() {
  try {
    const rawData = await loadGameData();
    const data = {
      completed_games: (rawData.completed_games || []).map(normalizeGame),
      to_play_games: (rawData.to_play_games || []).map(normalizeGame)
    };

    const stats = calculateStats(data);
    renderStats(stats);

    setUpFilterScaffolding(data);
    renderActiveGames(getActiveGames(data));
    renderCompletedGames(data.completed_games);
    renderPlannedGames(data.to_play_games);

    wireEventHandlers(data);
  } catch (error) {
    const statsGrid = document.getElementById("stats-grid");
    const activeGrid = document.getElementById("active-grid");
    statsGrid.innerHTML = `<p>Unable to load game data. Please verify data/games.json.</p>`;
    activeGrid.innerHTML = emptyStateMarkup("No active runs right now", "Game data could not be loaded.");
    console.error(error);
  }
}

initializeSite();
