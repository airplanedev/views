// TextEncoder is needed for AirplaneFile and not defined in env jsdom,
// so we polyfill it.
import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;

import { rest } from "msw";

import { server } from "client/test-utils/mock";
import { act, renderHook } from "test-utils/react";

import { useUploadAirplaneFiles } from "./useUploadAirplaneFiles";

describe("useUploadAirplaneFiles", () => {
  it("upload succeeds", async () => {
    server.use(
      rest.post("http://api/v0/uploads/create", (req, res, ctx) => {
        const b = req.body as {
          fileName: string;
          sizeBytes: number;
        };
        expect(b.fileName).toEqual("foo.txt");
        expect(b.sizeBytes).toEqual(3);
        return res(
          ctx.json({
            upload: { id: "uid" },
            readOnlyURL: "http://api/readOnlyURL",
            writeOnlyURL: "http://api/writeOnlyURL",
          }),
        );
      }),
    );
    server.use(
      rest.put("http://api/writeOnlyURL", (req, res, ctx) => {
        return res(ctx.json({}));
      }),
    );

    const onChange = jest.fn();
    const onLoad = jest.fn();
    const onLoadEnd = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useUploadAirplaneFiles({
        onChange,
        onLoad,
        onLoadEnd,
        onError,
      }),
    );

    await act(() => {
      result.current.onDrop([new File(["foo"], "foo.txt")]);
    });
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "uid",
          url: "http://api/readOnlyURL",
          name: "foo.txt",
        }),
      ]),
    );
    expect(result.current.uploads).toHaveLength(0);
  });

  it("create upload fails", async () => {
    server.use(
      rest.post("http://api/v0/uploads/create", (req, res, ctx) => {
        const b = req.body as {
          fileName: string;
          sizeBytes: number;
        };
        expect(b.fileName).toEqual("foo.txt");
        expect(b.sizeBytes).toEqual(3);
        return res(ctx.status(401), ctx.json({ error: "Forbidden" }));
      }),
    );

    const onChange = jest.fn();
    const onLoad = jest.fn();
    const onLoadEnd = jest.fn();
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useUploadAirplaneFiles({
        onChange,
        onLoad,
        onLoadEnd,
        onError,
      }),
    );

    await act(() => {
      result.current.onDrop([new File(["foo"], "foo.txt")]);
    });

    expect(onLoad).not.toHaveBeenCalled();
    expect(onLoadEnd).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ message: "Forbidden" }),
    );

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: "",
          url: "",
          name: "foo.txt",
        }),
      ]),
    );
    expect(result.current.uploads).toHaveLength(0);
  });
});
