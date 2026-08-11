const root = document.querySelector("[data-portfolio-root]");
const base = (root?.dataset.base || ".").replace(/\/$/, "");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const safeId = (value = "section") =>
  String(value).toLowerCase().replace(/[^a-z0-9-]/g, "-");
const href = (value = "") => escapeHtml(value);
const asset = (path) => `${base}/${String(path).replace(/^\//, "")}`;
const link = (label, url) =>
  url
    ? `<a href="${href(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    : escapeHtml(label);
const mail = (address) =>
  `<a href="mailto:${href(address)}">${escapeHtml(address)}</a>`;
const phone = (label, number) =>
  `<a href="tel:${href(number)}">${escapeHtml(label)}</a>`;

function render(data) {
  const p = data.profile;

  const briefCv = [
    ...data.experience.map(
      (item) => `<li><b>${escapeHtml(item.role)}</b>, ${link(item.institution, item.institutionUrl)},
        ${escapeHtml(item.location)}, ${escapeHtml(item.period)}</li>`,
    ),
    ...data.education
      .filter((item) => !["Higher Secondary Education", "Secondary Education"].includes(item.degree))
      .map((item) => {
        const showResearchDetails = item.degree.startsWith("Ph.D.");
        return `<li><b>${escapeHtml(item.degree)}</b>, ${link(item.institution, item.institutionUrl)},
          ${escapeHtml(item.period)}
          ${showResearchDetails && item.thesis ? `<span class="sub">Thesis: ${link(item.thesis, item.thesisUrl)}</span>` : ""}
          ${showResearchDetails && item.advisor ? `<span class="sub">Advisor: ${link(item.advisor, item.advisorUrl)}</span>` : ""}</li>`;
      }),
  ].join("");

  const awards = data.awards
    .map(
      (item) => `<li><b>${escapeHtml(item.title)}</b>${item.detail ? `, ${escapeHtml(item.detail)}` : ""}${
        item.date ? ` <span class="quiet">(${escapeHtml(item.date)})</span>` : ""
      }</li>`,
    )
    .join("");

  const publications = data.publications
    .map(
      (item, index) => `<tr>
        <td class="no">${index + 1}.</td>
        <td>${escapeHtml(item.authors)} (${escapeHtml(item.year)}).
          “${link(item.title, item.url)}.”
          <b>${escapeHtml(item.journal)}</b>, ${escapeHtml(item.volume)}, ${escapeHtml(item.pages)}.
          ${item.quartile ? `<span class="tag">${escapeHtml(item.quartile)}</span>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const conferences = data.conferences
    .map(
      (item) => `<tr>
        <td class="yr">${escapeHtml(item.date)}</td>
        <td><b>“${escapeHtml(item.talk)}”</b>
          <span class="sub">${link(item.event, item.eventUrl)} · ${escapeHtml(item.location)}</span>
        </td>
      </tr>`,
    )
    .join("");

  const workshops = data.workshops
    .map(
      (item) => `<tr><td class="yr">${escapeHtml(item.date)}</td><td>${escapeHtml(item.text)}</td></tr>`,
    )
    .join("");

  const teaching = data.teaching
    .map(
      (item) => `<tr>
        <td class="yr">${escapeHtml(item.term)}</td>
        <td><b>${escapeHtml(item.course)}</b>${item.code ? ` (${escapeHtml(item.code)})` : ""}
          <span class="sub">${escapeHtml(item.audience)}</span>
        </td>
      </tr>`,
    )
    .join("");

  const education = data.education
    .map(
      (item) => `<tr>
        <td class="yr">${escapeHtml(item.period)}</td>
        <td><b>${escapeHtml(item.degree)}</b>
          <span class="sub">${link(item.institution, item.institutionUrl)} · ${escapeHtml(item.location)}</span>
          ${item.details?.length ? `<span class="sub">${item.details.map(escapeHtml).join(" · ")}</span>` : ""}
          ${item.thesis ? `<span class="sub">Thesis: ${link(item.thesis, item.thesisUrl)}</span>` : ""}
          ${item.advisor ? `<span class="sub">Advisor: ${link(item.advisor, item.advisorUrl)}</span>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const customSections = (data.customSections || [])
    .map(
      (section) => `<section class="custom-section" id="${safeId(section.id || section.title)}">
        <h2>${escapeHtml(section.title || "More information")}</h2>
        ${section.intro ? `<p class="note">${escapeHtml(section.intro)}</p>` : ""}
        <table class="rec"><tbody>${(section.items || [])
          .map(
            (item) => `<tr><td class="yr">${escapeHtml(item.date || "")}</td><td>
              <b>${item.url ? link(item.title, item.url) : escapeHtml(item.title)}</b>
              ${item.text ? `<span class="sub">${escapeHtml(item.text)}</span>` : ""}
            </td></tr>`,
          )
          .join("")}</tbody></table>
      </section>`,
    )
    .join("");

  const gallery = (data.gallery || []).length
    ? `<h2>Gallery</h2><div class="gallery">${data.gallery
        .map(
          (item) => `<figure><img src="${asset(item.src)}" alt="${escapeHtml(
            item.alt || item.caption || "Academic gallery image",
          )}" loading="lazy" decoding="async" /><figcaption>${escapeHtml(item.caption || "")}</figcaption></figure>`,
        )
        .join("")}</div>`
    : "";

  root.innerHTML = `
    <header class="cover">
      <picture class="cover-picture" aria-hidden="true">
        <source type="image/webp" srcset="${asset(p.coverWebpSmall)} 840w, ${asset(p.coverWebp)} 1672w" sizes="100vw" />
        <img class="cover-image" src="${asset(p.cover)}" alt="" width="1672" height="941" decoding="async" fetchpriority="high" />
      </picture>
      <div class="cover-overlay" aria-hidden="true"></div>
      <div class="wrap cover-content">
        <h1>${escapeHtml(p.name)}</h1>
        <p class="cover-role">${escapeHtml(p.role)} <span>·</span> Mathematics</p>
        <p class="cover-focus">${escapeHtml(p.researchLine)}</p>
      </div>
    </header>

    <nav class="tabs" aria-label="Portfolio sections">
      <div class="wrap" role="tablist" aria-label="Sections">
        <button class="tab on" data-panel="home" role="tab" aria-selected="true" aria-controls="p-home" id="t-home">Home</button>
        <button class="tab" data-panel="publications" role="tab" aria-selected="false" aria-controls="p-publications" id="t-publications">Publications</button>
        <button class="tab" data-panel="conferences" role="tab" aria-selected="false" aria-controls="p-conferences" id="t-conferences">Conferences</button>
        <button class="tab" data-panel="teaching" role="tab" aria-selected="false" aria-controls="p-teaching" id="t-teaching">Teaching</button>
        <button class="tab" data-panel="academic" role="tab" aria-selected="false" aria-controls="p-academic" id="t-academic">Education</button>
        <button class="tab" data-panel="contact" role="tab" aria-selected="false" aria-controls="p-contact" id="t-contact">Contact</button>
      </div>
    </nav>

    <main><div class="wrap">
      <section class="panel on" id="p-home" role="tabpanel" aria-labelledby="t-home">
        <div class="profile">
          <picture class="profile-photo">
            <source type="image/webp" srcset="${asset(p.photoWebpSmall)} 420w, ${asset(p.photoWebp)} 841w" sizes="(max-width: 650px) 150px, (max-width: 820px) 165px, 190px" />
            <img src="${asset(p.photo)}" alt="Portrait of ${escapeHtml(p.name)}" width="841" height="762" decoding="async" />
          </picture>
          <div class="who">
            <h2 class="plain">${escapeHtml(p.name)}</h2>
            <p class="role">${escapeHtml(p.role)}</p>
            <p>${link(p.institution, p.institutionUrl)}</p>
            <p>${escapeHtml(p.location)}</p>
            <p>${mail(p.email)} &nbsp;|&nbsp; ${phone(p.phone, p.phoneLink)}</p>
            <div class="links">
              <a class="profile-icon-link" href="${href(p.orcidUrl)}" target="_blank" rel="noopener noreferrer" aria-label="ORCID profile" title="ORCID">
                <span class="profile-icon orcid-icon" aria-hidden="true"></span>
              </a>
              <a class="profile-icon-link" href="${href(p.googleScholarUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar profile" title="Google Scholar">
                <span class="profile-icon google-scholar-icon" aria-hidden="true"></span>
              </a>
              <a class="profile-icon-link" href="${href(p.scopusUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Scopus profile" title="Scopus">
                <span class="profile-icon scopus-icon" aria-hidden="true"></span>
              </a>
              <a class="profile-icon-link" href="${href(p.researchGateUrl)}" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate profile" title="ResearchGate">
                <span class="profile-icon researchgate-icon" aria-hidden="true"></span>
              </a>
              <a class="profile-icon-link mathscinet-link" href="${href(p.mathSciNetUrl)}" target="_blank" rel="noopener noreferrer" aria-label="MathSciNet profile" title="MathSciNet">
                <img src="${asset("assets/mathscinet.png")}" alt="" width="712" height="794" decoding="async" aria-hidden="true" />
              </a>
              <a class="text-link" href="${asset(p.cv)}" target="_blank" rel="noopener noreferrer">Download CV</a>
            </div>
          </div>
        </div>

        <p class="intro">${escapeHtml(p.intro)}</p>
        <h2>Brief CV</h2>
        <ul class="list">${briefCv}</ul>

        <h2>Research Interests</h2>
        <p><b>Broad area:</b> ${escapeHtml(data.research.broadArea)}</p>
        <ul class="list">${data.research.interests.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

        <h2>Awards and Scholarships</h2>
        <ul class="list">${awards}</ul>
      </section>

      <section class="panel" id="p-publications" role="tabpanel" aria-labelledby="t-publications" hidden>
        <h2>Published Articles</h2>
        <table class="rec"><tbody>${publications}</tbody></table>
      </section>

      <section class="panel" id="p-conferences" role="tabpanel" aria-labelledby="t-conferences" hidden>
        <h2>Conference Talks</h2>
        <table class="rec"><tbody>${conferences}</tbody></table>
        <h2>Workshops and Seminars</h2>
        <table class="rec"><tbody>${workshops}</tbody></table>
      </section>

      <section class="panel" id="p-teaching" role="tabpanel" aria-labelledby="t-teaching" hidden>
        <h2>Teaching Assistant / Tutor Experience</h2>
        <table class="rec teaching-list"><tbody>${teaching}</tbody></table>
        <h2>Technical Skills</h2>
        <p>${data.skills.map(escapeHtml).join(" · ")}</p>
        <h2>Languages</h2>
        <p>${data.languages.map(escapeHtml).join(" · ")}</p>
      </section>

      <section class="panel" id="p-academic" role="tabpanel" aria-labelledby="t-academic" hidden>
        <h2>Education</h2>
        <table class="rec education-list"><tbody>${education}</tbody></table>
        <h2>Awards and Scholarships</h2>
        <ul class="list">${awards}</ul>
        ${customSections}
        ${gallery}
      </section>

      <section class="panel" id="p-contact" role="tabpanel" aria-labelledby="t-contact" hidden>
        <h2>Contact</h2>
        <div class="contact-card">
          <p><b>${escapeHtml(p.name)}</b><br />${escapeHtml(p.role)}<br />
            ${link(p.institution, p.institutionUrl)}<br />${escapeHtml(p.location)}</p>
          <p>Email: ${mail(p.email)}<br />Phone: ${phone(p.phone, p.phoneLink)}<br />
            ORCID: ${link(p.orcid, p.orcidUrl)}</p>
          <p><a class="cv-link" href="${asset(p.cv)}" target="_blank" rel="noopener noreferrer">Open full curriculum vitae (PDF)</a></p>
        </div>

      </section>
    </div></main>

    <footer><div class="wrap"><span>© ${new Date().getFullYear()} ${escapeHtml(p.name)}</span>
      <span>${escapeHtml(p.role)} · Mathematics · Last updated ${escapeHtml(data.site.lastUpdated)}</span></div></footer>
  `;

  document.title = data.site.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", data.site.description);

  const tabs = [...document.querySelectorAll(".tab")];
  const panels = [...document.querySelectorAll(".panel")];

  const activate = (name, { focus = false, updateHash = true } = {}) => {
    const selected = tabs.find((tab) => tab.dataset.panel === name) || tabs[0];
    const selectedName = selected.dataset.panel;

    tabs.forEach((tab) => {
      const on = tab === selected;
      tab.classList.toggle("on", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel) => {
      const on = panel.id === `p-${selectedName}`;
      panel.classList.toggle("on", on);
      panel.hidden = !on;
    });

    if (focus) selected.focus();
    if (updateHash && window.location.hash !== `#${selectedName}`) {
      history.replaceState(null, "", `#${selectedName}`);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.panel));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      activate(tabs[nextIndex].dataset.panel, { focus: true });
    });
  });

  window.addEventListener("hashchange", () => activate(window.location.hash.slice(1), { updateHash: false }));
  activate(window.location.hash.slice(1) || "home", { updateHash: false });
}

fetch(`${base}/profile.json`, { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Profile data could not be loaded (${response.status}).`);
    return response.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
    root.innerHTML = `<div class="load-error"><strong>Portfolio content could not be loaded.</strong><p>Please refresh the page.</p></div>`;
  });
