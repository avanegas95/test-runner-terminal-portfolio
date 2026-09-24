"""Page Object for the GUI portfolio homepage."""

from __future__ import annotations

from playwright.sync_api import Locator, Page, expect

SECTION_IDS = (
    "hero",
    "experience",
    "projects",
    "skills",
    "about",
    "education",
    "contact",
)

NAV_SECTION_IDS = (
    "experience",
    "projects",
    "skills",
    "about",
    "contact",
)

_NAV_LABELS = {
    "experience": "Experience",
    "projects": "Projects",
    "skills": "Skills",
    "about": "About",
    "contact": "Contact",
}


class HomePage:
    """Homepage interactions using the data-testid contract."""

    def __init__(self, page: Page, base_url: str) -> None:
        self.page = page
        self.base_url = base_url.rstrip("/")

    def goto(self, *, terminal: bool = False, cmd: str | None = None) -> None:
        """Navigate to the homepage, optionally opening the terminal via query params."""
        url = self.base_url + "/"
        params: list[str] = []
        if terminal:
            params.append("terminal")
        if cmd:
            params.append(f"cmd={cmd}")
        if params:
            url += "?" + "&".join(params)
        self.page.goto(url)
        self.page.wait_for_load_state("domcontentloaded")

    def section(self, section_id: str) -> Locator:
        return self.page.get_by_test_id(f"section-{section_id}")

    def all_sections(self) -> list[Locator]:
        return [self.section(section_id) for section_id in SECTION_IDS]

    def nav_link(self, section_id: str) -> Locator:
        label = _NAV_LABELS.get(section_id, section_id.replace("_", " ").title())
        return self.page.get_by_role("link", name=label)

    def terminal_toggle(self) -> Locator:
        return self.page.get_by_test_id("terminal-toggle")

    def pytest_teaser(self) -> Locator:
        return self.page.get_by_test_id("pytest-teaser")

    def view_in_terminal_links(self) -> Locator:
        return self.page.get_by_test_id("view-in-terminal")

    def resume_link(self) -> Locator:
        return self.page.get_by_role("link", name="Resume")

    def contact_email_link(self) -> Locator:
        return self.page.get_by_role("link", name=lambda name: "@" in (name or ""))

    def expect_all_sections_visible(self) -> None:
        for section_id in SECTION_IDS:
            expect(self.section(section_id)).to_be_visible()

    def scroll_to_section(self, section_id: str) -> None:
        self.section(section_id).scroll_into_view_if_needed()

    def section_is_in_viewport(self, section_id: str) -> bool:
        box = self.section(section_id).bounding_box()
        if not box:
            return False
        viewport = self.page.viewport_size
        if not viewport:
            return False
        return (
            box["y"] >= 0
            and box["y"] + box["height"] <= viewport["height"]
        )
