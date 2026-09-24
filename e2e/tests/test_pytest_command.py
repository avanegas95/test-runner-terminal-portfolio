"""Regression tests: pytest command output and filtering."""

from __future__ import annotations

import pytest
from playwright.sync_api import Page, expect

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.regression


@pytest.fixture
def terminal_open(home: HomePage, terminal: TerminalPage) -> TerminalPage:
    terminal.open_via_toggle()
    return terminal


def test_pytest_default_shows_summary_recap(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest")
    terminal_open.wait_for_output_containing("passed")
    terminal_open.wait_for_output_containing("FAILED")


def test_pytest_verbose_flag(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest -v")
    terminal_open.wait_for_output_containing("PASSED")


def test_pytest_quiet_dots_view(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest -q")
    terminal_open.wait_for_output_containing("passed")


def test_pytest_keyword_filter(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest -k appium")
    terminal_open.wait_for_output_containing("collected")


def test_pytest_marker_filter(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest -m regression")
    terminal_open.wait_for_output_containing("collected")


def test_pytest_last_failed(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("pytest --lf")
    terminal_open.wait_for_output_containing("flaky")


def test_pytest_teaser_runs_pytest(home: HomePage, terminal: TerminalPage) -> None:
    home.pytest_teaser().click()
    terminal.expect_open()
    terminal.wait_for_output_containing("passed")


def test_pytest_reduced_motion_is_instant(
    page: Page,
    base_url: str,
    reduced_motion: bool,
) -> None:
    home = HomePage(page, base_url)
    home.goto()
    terminal = TerminalPage(page)
    terminal.open_via_toggle()
    terminal.run_command("pytest")
    terminal.wait_for_output_containing("passed")
    # With reduced motion, full output should appear quickly (no long animation wait).
    expect(terminal.output()).to_contain_text("short test summary", timeout=3_000)
