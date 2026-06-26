import { render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

describe("PostCard", () => {
  it("exibe likes e dislikes recebidos da API", () => {
    render(
      <PostCard
        post={{
          id: 1,
          title: "Post de teste",
          body: "Conteúdo do post",
          reactions: { likes: 42, dislikes: 3 },
          liked: false,
        }}
        isAuthenticated={false}
        onLike={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByLabelText("Reações do post").textContent).toContain("👍 42");
    expect(screen.getByLabelText("Reações do post").textContent).toContain("👎 3");
  });
});
