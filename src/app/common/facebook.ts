function getCommentCountAndLike(html: string, postId: string) {
  let totalComment = null;
  let totalLike = null;
  let found = false;

  // 2️⃣ Tìm tất cả <script type="application/json" data-sjs>...</script>
  const scriptBlocks = [
    ...html.matchAll(
      /<script[^>]*type="application\/json"[^>]*data-sjs[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => m[1]);

  if (scriptBlocks.length === 0) {
    return null;
  }

  // 3️⃣ Lặp qua từng block JSON
  for (const block of scriptBlocks) {
    if (found) break; // dừng nếu đã có đủ dữ liệu
    try {
      const json = JSON.parse(block);

      if (json.require) {
        for (const item of json.require) {
          if (found) break;
          const dataArray = item[3];
          if (Array.isArray(dataArray)) {
            for (const obj of dataArray) {
              const jsonString = JSON.stringify(obj);

              // tìm đúng post_id
              if (jsonString.includes(`"post_id":"${postId}"`)) {
                const matchComment = jsonString.match(
                  /"total_comment_count":(\d+)/,
                );
                if (matchComment?.[1]) totalComment = matchComment[1];

                const matchLike = jsonString.match(/"likers":\{"count":(\d+)}/);
                if (matchLike?.[1]) totalLike = matchLike[1];

                if (totalComment && totalLike) {
                  // ✅ đã tìm thấy đủ, dừng toàn bộ
                  found = true;
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) {}
  }

  return {
    totalLike,
    totalComment,
  };
}

export { getCommentCountAndLike };
