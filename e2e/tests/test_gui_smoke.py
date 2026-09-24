"""Smoke tests: GUI sections, navigation, and contact links."""

from __future__ import annotations

import pytest
from playwright.sync_api import expect

from pages.home_page import HomePage, NAV_SECTION_IDS, SECTION_IDS

pytestmark = pytest.mark.smoke


def test_homepage_loads_with_all_sections(home: HomePage) -> None:
    home.expect_all_sections_visible()


@pytest.mark.parametrize("section_id", NAV_SECTION_IDS)
def test_nav_anchor_scrolls_to_section(home: HomePage, section_id: str) -> None:
    home.nav_link(section_id).click()
    expect(home.section(section_id)).to_be_in_viewport()


def test_resume_link_points_to_pdf(home: HomePage) -> None:
    expect(home.resume_link()).to_have_attribute(
        "href", "/Anderson_Vanegas_Resume.pdf"
    )


def test_contact_has_mailto_link(home: HomePage) -> None:
    email_link = home.page.get_by_role("link", name=lambda name: "@" in (name or ""))
    expect(email_link.first).to_have_attribute("href", lambda href: href.startswith("mailto:"))


def test_pytest_teaser_is_visible(home: HomePage) -> None:
    expect(home.pytest_teaser()).to_be_visible()
    expect(home.pytest_teaser()).to_contain_text("pytest")


def test_terminal_toggle_is_visible(home: HomePage) -> None:
    expect(home.terminal_toggle()).to_be_visible()
