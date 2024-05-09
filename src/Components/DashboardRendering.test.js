import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import Dashboard from "./Dashboard";

// Mock the gapi client
global.gapi = {
  client: {
    calendar: {
      events: {
        list: jest.fn().mockImplementation(() =>
          Promise.resolve({
            result: {
              items: [],
            },
          })
        ),
      },
    },
  },
};

jest.mock("./EventList", () => () => <div>Mock EventList</div>);
jest.mock("./EventGroupDisplayCard", () => () => (
  <div>Mock EventGroupDisplayCard</div>
));
jest.mock("./DashboardControls", () => () => <div>Mock DashboardControls</div>);
jest.mock("./EventGroupChartDisplay", () => () => (
  <div>Mock EventGroupChartDisplay</div>
));

const mockMakeRequest = jest.fn();

afterEach(() => {
  cleanup();
  mockMakeRequest.mockReset();
});

describe("Dashboard", () => {
  it("displays the EventList when a group is selected", async () => {
    await act(async () => {
      render(<Dashboard selectedGroup={{ name: "Test Group" }} />);
    });
    expect(screen.getByText("Mock EventList")).toBeInTheDocument();
  });
});
