"""Accessibility tests: axe scans with terminal open and closed."""

from __future__ import annotations

import pytest
from axe_playwright_python.sync_playwright import Axe
from playwright.sync_api import Page

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.a11y


def _assert_no_violations(page: Page, *, context: str) -> None:
    results = Axe().run(page)
    violations = results.response.get("violations", [])
    assert not violations, (
        f"axe found {len(violations)} violation(s) with {context}: "
        + ", ".join(v["id"] for v in violations)
    )


def test_a11y_homepage_drawer_closed(home: HomePage, page: Page) -> None:
    _assert_no_violations(page, context="drawer closed")


def test_a11y_homepage_drawer_open(
    home: HomePage, terminal: TerminalPage, page: Page
) -> None:
    terminal.open_via_toggle()
    _assert_no_violations(page, context="drawer open")
