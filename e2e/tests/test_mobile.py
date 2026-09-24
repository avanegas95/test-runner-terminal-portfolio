"""Mobile viewport tests: sheet layout, quick commands, keyboard-safe input."""

from __future__ import annotations

import pytest
from playwright.sync_api import Page, expect

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = [pytest.mark.mobile, pytest.mark.parametrize("viewport_name", ["mobile"], indirect=True)]


def test_mobile_terminal_opens_as_full_sheet(
    page: Page, home: HomePage, terminal: TerminalPage, viewport_name: str
) -> None:
    terminal.open_via_toggle()
    drawer = terminal.drawer()
    expect(drawer).to_be_visible()
    box = drawer.bounding_box()
    viewport = page.viewport_size
    assert box and viewport
    assert box["height"] >= viewport["height"] * 0.9


def test_mobile_quick_command_chips_visible(
    home: HomePage, terminal: TerminalPage
) -> None:
    terminal.open_via_toggle()
    chips = terminal.quick_commands()
    expect(chips.first).to_be_visible()
    expect(chips).to_have_count(6, timeout=5_000)


def test_mobile_quick_command_runs_tutorial(
    home: HomePage, terminal: TerminalPage
) -> None:
    terminal.open_via_toggle()
    terminal.click_quick_command("tutorial")
    terminal.wait_for_output_containing("terminal")


def test_mobile_input_stays_visible_with_keyboard(
    page: Page, home: HomePage, terminal: TerminalPage
) -> None:
    terminal.open_via_toggle()
    terminal.input().click()
    terminal.input().fill("ls")
    # Simulate keyboard by focusing input; visualViewport handling is app-side.
    expect(terminal.input()).to_be_in_viewport()
    terminal.input().press("Enter")
    terminal.wait_for_output_containing("README.md")
