"""Sanity tests: terminal ↔ GUI bridge (scroll, view-in-terminal links)."""

from __future__ import annotations

import pytest
from playwright.sync_api import expect

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.sanity


@pytest.fixture
def terminal_open(home: HomePage, terminal: TerminalPage) -> TerminalPage:
    terminal.open_via_toggle()
    return terminal


def test_open_experience_scrolls_gui_section(
    home: HomePage, terminal_open: TerminalPage
) -> None:
    terminal_open.run_command("open experience")
    expect(home.section("experience")).to_be_in_viewport()


def test_open_projects_scrolls_gui_section(
    home: HomePage, terminal_open: TerminalPage
) -> None:
    terminal_open.run_command("open projects")
    expect(home.section("projects")).to_be_in_viewport()


def test_view_in_terminal_link_runs_cat_command(
    home: HomePage, terminal: TerminalPage
) -> None:
    link = home.view_in_terminal_links().first
    expect(link).to_be_visible()
    link.click()
    terminal.expect_open()
    terminal.wait_for_output_containing("cat")


def test_view_in_terminal_shows_role_content(
    home: HomePage, terminal: TerminalPage
) -> None:
    home.view_in_terminal_links().first.click()
    terminal.wait_for_output_containing("Boston Dynamics")
