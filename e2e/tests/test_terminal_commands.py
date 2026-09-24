"""Regression tests: core terminal commands."""

from __future__ import annotations

import pytest

from pages.home_page import HomePage
from pages.terminal import TerminalPage

pytestmark = pytest.mark.regression


@pytest.fixture
def terminal_open(home: HomePage, terminal: TerminalPage) -> TerminalPage:
    terminal.open_via_toggle()
    return terminal


@pytest.mark.parametrize(
    "command,expected_snippet",
    [
        ("ls", "README.md"),
        ("ls experience", "boston_dynamics"),
        ("pwd", "/home/anderson"),
        ("cd experience", ""),
        ("cat README.md", "welcome"),
        ("tree", "experience"),
        ("help", "ls"),
        ("foo", "command not found"),
    ],
)
def test_terminal_command_output(
    terminal_open: TerminalPage,
    command: str,
    expected_snippet: str,
) -> None:
    terminal_open.run_command(command)
    if expected_snippet:
        terminal_open.wait_for_output_containing(expected_snippet)


def test_cd_and_pwd_sequence(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("cd experience/boston_dynamics")
    terminal_open.run_command("pwd")
    terminal_open.wait_for_output_containing("boston_dynamics")


def test_cd_dash_returns_to_previous_directory(terminal_open: TerminalPage) -> None:
    terminal_open.run_command("cd experience")
    terminal_open.run_command("cd ..")
    terminal_open.run_command("cd -")
    terminal_open.wait_for_output_containing("experience")
