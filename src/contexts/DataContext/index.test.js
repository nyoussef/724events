import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  it("a call is executed on the events.json file", async () => {
    api.loadData = jest.fn().mockReturnValue({ result: "ok" });
    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });
  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });
  });
  it("api.loadData", () => {
    window.console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue(() =>
      Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
      })
    );
    const Component = () => {
      const { error } = useData();
      return <div>{error}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
  });

  // Nouveau test pour la propriété 'last'
  describe("when `last` is used", () => {
    it("should correctly identify the most recent event", async () => {
      // Simuler les données avec plusieurs événements
      const mockData = {
        events: [
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
          }
        ]
      };

      api.loadData = jest.fn().mockResolvedValue(mockData);

      const Component = () => {
        const { last } = useData();
        return (
          <div>
            <h1>{last?.title}</h1>
            <img src={last?.cover} alt={last?.title} />
          </div>
        );
      };

      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );

      // Vérifier que l'événement le plus récent est correctement affiché
      const lastEventTitle = await screen.findByText("World Gaming Day");
      const lastEventImage = screen.getByAltText("World Gaming Day");
      
      expect(lastEventTitle).toBeInTheDocument();
      expect(lastEventImage).toHaveAttribute('src', '/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png');
    });
  });
});