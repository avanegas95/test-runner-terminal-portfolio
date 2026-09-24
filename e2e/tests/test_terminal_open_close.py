"""Smoke tests: terminal open/close paths and focus management."""

from __future__ import annotations

import pytest
from playwright.sync_api import expect

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.smoke


def test_open_via_toggle_button(home: HomePage, terminal: TerminalPage) -> None:
    terminal.open_via_toggle()
    terminal.expect_open()


def test_open_via_ctrl_backtick(home: HomePage, terminal: TerminalPage) -> None:
    terminal.open_via_keyboard()
    terminal.expect_open()


def test_close_via_x_button(home: HomePage, terminal: TerminalPage) -> None:
    terminal.open_via_toggle()
    terminal.close_via_button()


def test_close_via_exit_command(home: HomePage, terminal: TerminalPage) -> None:
    terminal.open_via_toggle()
    terminal.run_exit()


def test_close_via_escape_when_input_empty(
    home: HomePage, terminal: TerminalPage
) -> None:
    terminal.open_via_toggle()
    terminal.close_via_escape()


def test_focus_returns_to_toggle_after_close(
    home: HomePage, terminal: TerminalPage
) -> None:
    toggle = home.terminal_toggle()
    toggle.focus()
    terminal.open_via_toggle()
    terminal.run_exit()
    expect(toggle).to_be_focused()


def test_deep_link_opens_terminal(home: HomePage, terminal: TerminalPage) -> None:
    home.goto(terminal=True)
    terminal.expect_open()
