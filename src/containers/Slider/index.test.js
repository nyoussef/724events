import { render, screen, waitFor } from "@testing-library/react";
import Slider from "./index";
import { api, DataProvider } from "../../contexts/DataContext";

const data = {
  focus: [
    {
      title: "World economic forum",
      description:
        "Oeuvre à la coopération entre le secteur public et le privé.",
      date: "2022-02-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Gaming Day",
      description: "Evenement mondial autour du gaming",
      date: "2022-03-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
    {
      title: "World Farming Day",
      description: "Evenement mondial autour de la ferme",
      date: "2022-01-29T20:28:45.744Z",
      cover: "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png",
    },
  ],
};

describe("When slider is created", () => {
  it("a list card is displayed", async () => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockReturnValue(data);
    render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );
    await screen.findByText("World economic forum");
    await screen.findByText("janvier");
    await screen.findByText(
      "Oeuvre à la coopération entre le secteur public et le privé."
    );
  });
});


describe("Slider Component", () => {
  beforeEach(() => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockReturnValue(data);
  });

  it("should sort events by date in descending order", async () => {
    render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    // Extraire les éléments h3
    const headings = await screen.findAllByRole('heading', { level: 3 });

    // Vérifier les titres en ordre décroissant
    expect(headings[0].textContent).toBe("World Gaming Day");
    expect(headings[1].textContent).toBe("World economic forum");
    expect(headings[2].textContent).toBe("World Farming Day");
  });

  it("should display the correct number of slides", async () => {
    render(
      <DataProvider>
        <Slider />
      </DataProvider>
    );

    await waitFor(() => {
      const slides = screen.getAllByRole('img');
      expect(slides).toHaveLength(data.focus.length);
    });
  });
});