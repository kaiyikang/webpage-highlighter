document.addEventListener("mouseup", function () {

    // 清除之前的高亮
    clearHighlights();

    // 获取选中的文字
    let selectedText = window.getSelection().toString();

    if (selectedText) {
      console.log("选中的文字:", selectedText);

      // 在页面中查找并高亮相同的文字（忽略大小写）
      highlightSameText(selectedText);
    }
  });

  function clearHighlights() {
      const highlights = document.querySelectorAll('.highlighted-text');
      highlights.forEach(highlight => {
          const parent = highlight.parentNode;
          parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
          // 如果父元素是一个空的span，则移除它
          if (parent.tagName === 'SPAN' && !parent.hasAttributes() && parent.textContent === highlight.textContent) {
              parent.parentNode.replaceChild(document.createTextNode(parent.textContent), parent);
          }
      });

  }

  function highlightSameText(searchText) {
      if (!searchText) return 0;

      // 递归函数来处理嵌套元素
      function processNode(node) {
          if (node.nodeType === Node.TEXT_NODE) {
              // 处理文本节点
              const text = node.textContent;
              if (text.toLowerCase().includes(searchText.toLowerCase())) {
                  const regex = new RegExp(escapeRegExp(searchText), 'gi');
                  const span = document.createElement('span');
                  span.innerHTML = text.replace(regex, match =>
                      `<span class="highlighted-text">${match}</span>`
                  );
                  node.parentNode.replaceChild(span, node);
              }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
              // 跳过script、style和已经高亮的元素
              if (node.tagName === 'SCRIPT' ||
                  node.tagName === 'STYLE' ||
                  node.classList.contains('highlighted-text')) {
                  return;
              }

              // 处理元素内的所有子节点
              Array.from(node.childNodes).forEach(child => processNode(child));
          }
      }

      // 从body开始处理所有节点
      processNode(document.body);
  }

  // 辅助函数：转义正则表达式特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // 添加高亮样式
  const style = document.createElement("style");
  style.textContent = `
      .highlighted-text {
          background-color: yellow;
          padding: 2px;
          border-radius: 2px;
      }
  `;

  document.head.appendChild(style);
