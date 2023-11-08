import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import SwitcherButton from "./index";

describe("SwitcherButton", () => {
  it("Propsのmodeの値がcreateであればCreateボタンが太字になる", () => {
    render(
      <SwitcherButton
        mode="create"
        handleClickCreate={() => {}}
        handleClickUpdate={() => {}}
      />
    );

    const createButtonElement = screen.getByText("Create");
    expect(createButtonElement).toHaveClass("font-bold");
  });

  it("Propsのmodeの値がupdateであればUpdateボタンが太字になっている", () => {
    render(
      <SwitcherButton
        mode="update"
        handleClickCreate={() => {}}
        handleClickUpdate={() => {}}
      />
    );

    const updateButtonElement = screen.getByText("Update");
    expect(updateButtonElement).toHaveClass("font-bold");
  });

  it("ボタンが押されたら関数が動く", async () => {
    const handleClickCreate = jest.fn();
    const handleClickUpdate = jest.fn();

    render(
      <SwitcherButton
        mode="create"
        handleClickCreate={handleClickCreate}
        handleClickUpdate={handleClickUpdate}
      />
    );

    const createButtonElement = screen.getByText("Create");
    createButtonElement.click();
    expect(handleClickCreate).toHaveBeenCalledTimes(1);

    const updateButtonElement = screen.getByText("Update");
    updateButtonElement.click();
    expect(handleClickUpdate).toHaveBeenCalledTimes(1);
  });
});
