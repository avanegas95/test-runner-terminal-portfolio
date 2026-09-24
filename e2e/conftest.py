"""Shared pytest fixtures for Playwright e2e tests."""

from __future__ import annotations

import os

import pytest
from playwright.sync_api import Page

from pages.home_page import HomePage
from pages.terminal import TerminalPage

DEFAULT_BASE_URL = "http://localhost:3000"

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "tablet": {"width": 768, "height": 1024},
    "mobile": {"width": 390, "height": 844},
}


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.environ.get("BASE_URL", DEFAULT_BASE_URL)


@pytest.fixture
def viewport_name(request: pytest.FixtureRequest) -> str:
    """Parametrize with @pytest.mark.parametrize('viewport_name', ['desktop', 'tablet', 'mobile'])."""
    return getattr(request, "param", "desktop")


@pytest.fixture
def viewport_size(viewport_name: str) -> dict[str, int]:
    return VIEWPORTS[viewport_name]


@pytest.fixture
def reduced_motion() -> bool:
    """Request this fixture to enable prefers-reduced-motion in the browser context."""
    return True


@pytest.fixture
def browser_context_args(
    browser_context_args: dict,
    viewport_size: dict[str, int],
    request: pytest.FixtureRequest,
) -> dict:
    args = {**browser_context_args, "viewport": viewport_size}
    if "reduced_motion" in request.fixturenames:
        args["reduced_motion"] = "reduce"
    return args


@pytest.fixture
def home(page: Page, base_url: str) -> HomePage:
    home_page = HomePage(page, base_url)
    home_page.goto()
    return home_page


@pytest.fixture
def terminal(page: Page) -> TerminalPage:
    return TerminalPage(page)


@pytest.fixture
def home_with_terminal(home: HomePage, terminal: TerminalPage) -> tuple[HomePage, TerminalPage]:
    terminal.open_via_toggle()
    return home, terminal


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", "smoke: quick checks on every PR")
    config.addinivalue_line("markers", "sanity: targeted integration checks")
    config.addinivalue_line("markers", "regression: full terminal command coverage")
    config.addinivalue_line("markers", "mobile: mobile viewport and sheet behavior")
    config.addinivalue_line("markers", "a11y: accessibility scans with axe")
