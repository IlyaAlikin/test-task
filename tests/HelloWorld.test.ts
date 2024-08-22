// tests/HelloWorld.test.ts
import { render, fireEvent } from "@testing-library/vue";
import HelloWorld from "../src/components/HelloWorld.vue";

test("renders message and increments count", async () => {
  const { getByText } = render(HelloWorld, {
    props: {
      msg: "Hello Vue 3 + TypeScript!",
    },
  });

  // Проверка, что текст рендерится корректно
  getByText("Hello Vue 3 + TypeScript!");

  const button = getByText("Increment");
  await fireEvent.click(button); // Кликаем по кнопке

  // Проверка, что счетчик увеличился
  getByText("Count: 1");
});
