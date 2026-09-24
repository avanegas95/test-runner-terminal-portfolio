"""Sanity tests: legacy route redirects and hash mappings."""

from __future__ import annotations

import pytest
from playwright.sync_api import Page, expect

from pages.home_page import HomePage

pytestmark = pytest.mark.sanity


@pytest.mark.parametrize(
    "path,expected_fragment",
    [
        ("/projects", "projects"),
        ("/contact", "contact"),
        ("/known-issues", "about"),
    ],
)
def test_legacy_routes_redirect_to_anchors(
    page: Page, base_url: str, path: str, expected_fragment: str
) -> None:
    page.goto(f"{base_url}{path}", wait_until="networkidle")
    expect(page).to_have_url(f"{base_url}/#{expected_fragment}")


def test_resume_redirects_to_pdf(page: Page, base_url: str) -> None:
    response = page.goto(f"{base_url}/resume", wait_until="commit")
    assert response is not None
    assert response.url.endswith("/Anderson_Vanegas_Resume.pdf")


@pytest.mark.parametrize(
    "hash_fragment,section_id",
    [
        ("boston-dynamics", "experience"),
        ("sharkninja", "experience"),
    ],
)
def test_legacy_hash_maps_to_section(
    page: Page, base_url: str, hash_fragment: str, section_id: str
) -> None:
    page.goto(f"{base_url}/#{hash_fragment}")
    home = HomePage(page, base_url)
    expect(home.section(section_id)).to_be_in_viewport()
