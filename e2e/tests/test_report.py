"""Sanity tests: /report pytest-html resume view."""

from __future__ import annotations

import pytest
from playwright.sync_api import Page, expect

pytestmark = pytest.mark.sanity


@pytest.fixture
def report_page(page: Page, base_url: str) -> Page:
    page.goto(f"{base_url}/report")
    page.wait_for_load_state("domcontentloaded")
    return page


def test_report_page_renders_summary(report_page: Page) -> None:
    expect(report_page.get_by_role("heading", name="Test Report")).to_be_visible()
    expect(report_page.get_by_text("passed", exact=False)).to_be_visible()
    expect(report_page.get_by_text("failed", exact=False)).to_be_visible()


def test_report_environment_table_has_contact_info(report_page: Page) -> None:
    expect(report_page.get_by_text("Anderson Vanegas")).to_be_visible()
    expect(report_page.get_by_role("link", name=lambda n: "@" in (n or ""))).to_be_visible()


def test_report_filter_toggles_results(report_page: Page) -> None:
    passed_filter = report_page.get_by_role("button", name="Passed")
    failed_filter = report_page.get_by_role("button", name="Failed")
    expect(passed_filter).to_be_visible()
    expect(failed_filter).to_be_visible()
    failed_filter.click()
    expect(report_page.locator("[data-result='failed']")).to_be_visible()


def test_report_row_expands_to_show_details(report_page: Page) -> None:
    row = report_page.locator("[data-testid='report-row']").first
    row.click()
    expect(report_page.locator("[data-testid='report-row-detail']").first).to_be_visible()


def test_report_print_stylesheet_shows_all_sections(report_page: Page) -> None:
    report_page.emulate_media(media="print")
    expect(report_page.get_by_text("Experience", exact=False)).to_be_visible()
    expect(report_page.get_by_text("Projects", exact=False)).to_be_visible()
    expect(report_page.get_by_text("Skills", exact=False)).to_be_visible()
    expect(report_page.get_by_text("Education", exact=False)).to_be_visible()
