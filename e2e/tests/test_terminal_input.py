"""Regression tests: terminal input behavior (history, completion, shortcuts)."""

from __future__ import annotations

import pytest
from playwright.sync_api import expect

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.regression


@pytest.fixture
def terminal_open(home: HomePage, terminal: TerminalPage) -> TerminalPage:
    terminal.open_via_toggle()
    return terminal


def test_command_history_up_down(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("echo hello")
    terminal_open.run_command("echo world")
    terminal_open.input().fill("")
    terminal_open.press_arrow_up()
    expect(terminal_open.input()).to_have_value("echo world")
    terminal_open.press_arrow_up()
    expect(terminal_open.input()).to_have_value("echo hello")
    terminal_open.press_arrow_down()
    expect(terminal_open.input()).to_have_value("echo world")


def test_tab_completes_command_prefix(terminal_open: TerminalPage) -> None:
    terminal_open.input().fill("hel")
    terminal_open.press_tab()
    expect(terminal_open.input()).to_have_value("help")


def test_tab_completes_path(terminal_open: TerminalPage) -> None:
    terminal_open.input().fill("cat READ")
    terminal_open.press_tab()
    expect(terminal_open.input()).to_have_value("cat README.md")


def test_ctrl_c_clears_current_line(terminal_open: TerminalPage) -> None:
    terminal_open.input().fill("partial command")
    terminal_open.press_ctrl_c()
    expect(terminal_open.input()).to_have_value("")


def test_ctrl_l_clears_output(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("ls")
    terminal_open.wait_for_output_containing("README.md")
    terminal_open.press_ctrl_l()
    expect(terminal_open.output()).to_be_empty()
