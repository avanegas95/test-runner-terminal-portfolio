"""Page Object for the terminal drawer."""

from __future__ import annotations

from playwright.sync_api import Locator, Page, expect


class TerminalPage:
    """Terminal drawer interactions using the data-testid contract."""

    def __init__(self, page: Page) -> None:
        self.page = page

    def drawer(self) -> Locator:
        return self.page.get_by_test_id("terminal-drawer")

    def close_button(self) -> Locator:
        return self.page.get_by_test_id("terminal-close")

    def resize_handle(self) -> Locator:
        return self.page.get_by_test_id("terminal-resize-handle")

    def input(self) -> Locator:
        return self.page.get_by_test_id("terminal-input")

    def output(self) -> Locator:
        return self.page.get_by_test_id("terminal-output")

    def lines(self) -> Locator:
        return self.page.get_by_test_id("terminal-line")

    def quick_commands(self) -> Locator:
        return self.page.get_by_test_id("quick-command")

    def expect_open(self) -> None:
        expect(self.drawer()).to_be_visible()
        expect(self.input()).to_be_focused()

    def expect_closed(self) -> None:
        expect(self.drawer()).not_to_be_visible()

    def open_via_toggle(self) -> None:
        self.page.get_by_test_id("terminal-toggle").click()
        self.expect_open()

    def open_via_keyboard(self) -> None:
        self.page.keyboard.press("Control+Backquote")
        self.expect_open()

    def close_via_button(self) -> None:
        self.close_button().click()
        self.expect_closed()

    def close_via_escape(self) -> None:
        self.input().click()
        self.page.keyboard.press("Escape")
        self.expect_closed()

    def run_command(self, command: str) -> None:
        self.input().fill(command)
        self.input().press("Enter")

    def run_exit(self) -> None:
        self.run_command("exit")

    def output_text(self) -> str:
        return self.output().inner_text()

    def wait_for_output_containing(self, text: str, *, timeout: float = 10_000) -> None:
        expect(self.output()).to_contain_text(text, timeout=timeout)

    def line_count(self) -> int:
        return self.lines().count()

    def click_quick_command(self, label: str) -> None:
        self.quick_commands().filter(has_text=label).click()

    def press_tab(self) -> None:
        self.input().press("Tab")

    def press_ctrl_c(self) -> None:
        self.page.keyboard.press("Control+c")

    def press_ctrl_l(self) -> None:
        self.page.keyboard.press("Control+l")

    def press_arrow_up(self) -> None:
        self.input().press("ArrowUp")

    def press_arrow_down(self) -> None:
        self.input().press("ArrowDown")
