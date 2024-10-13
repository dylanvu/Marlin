EML_HEADER = """Delivered-To: dylanvu9@gmail.com
Received: by 2002:a05:6a10:f415:b0:594:2674:e74a with SMTP id g21csp1167838pxw;
Sat, 12 Oct 2024 16:02:45 -0700 (PDT)
X-Google-Smtp-Source: AGHT+IFggbpRgjSYeLpJpRP5BcxDlJ+QbLte3WcVowfQsq80MZ/zGpm1W40uLN3FeHolxzXNM4d9
X-Received: by 2002:a05:6000:118c:b0:37d:2ceb:ef92 with SMTP id ffacd0b85a97d-37d5fedbb12mr2712107f8f.27.1728774165500;
Sat, 12 Oct 2024 16:02:45 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1728774165; cv=none;
d=google.com; s=arc-20240605;
b=I38DwN8AZhWgiV+IZA4wo7MSQ9AgCW1DdZb4IrJG5Bk/ipUy7PpKkXAkyj3NKFpmVT
cUY1EhF+QotTdfO4+/Cpt0DnWU2vibQQ9fVOufI4nGUnHmuMO2tcJCfL9qEioGbB7wj3
g6CjMb5Deu0/rJiJ6eT28tjSM01arCKc8XJh7DPFkeZPbLUKOHaRMNn62Kyb306Cxejy
SEDdWTV2QMEoGor9TF4AkxM2EApx8bULyNkGILEN7GwDrKZAWwN/sUmr+ws4uiLpiLjs
SlbfdVfzDHjg3nw8gSczXhvt2JaNvuqahqp5DsAqBbfDdbUYUm762rKvH8V5t92eqyBZ
07EQ==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
h=mime-version:feedback-id:message-id:subject:from:to:date
:dkim-signature;
bh=+YJx1rQLvXfxJElqwwFOcwF7Mf/YPaP18tS/l+VZBHA=;
fh=+CtGwlrgug85vlnEFs5+bsL/tXK5U6KWAIcGWMS2ba4=;
b=HbtJHfc3w2jOByGBeKyNBZAdC8LMQ2LTra+9Zwho+gC0yg21qTUaKY75HKWf7pLWDi
xzxSjyGEo/nPoYt2Yx0brBovHQq+f2LwwhJViRB65DTnaq/bfPKj53jnR6QNC4JytIR4
Cj3Qvbb0So8aXpmKeft5uw4F3aUiYnt6TlOZchT8HKMhQhGxuHAbVIGgn97iILPQhGXA
s3JudL3vkoCTyoTlrQLR57rdAxdbDgbSUH//VT2wLqT5JeHuJWlTUDqUNNa/wAgehJLo
MlEuLsT8hk2MO+RlVxiPnoPgtGQnZAF+6YTYru4gvpGlgKvNsvJ2UctwPK3QrBT7J0g3
2MQA==;
dara=google.com
ARC-Authentication-Results: i=1; mx.google.com;
dkim=pass header.i=@proton.me header.s=h5ksftcudnhhlftogyloqf3ec4.protonmail header.b=foX9zkdU;
spf=pass (google.com: domain of cerebral_beach_support@proton.me designates 185.70.43.25 as permitted sender) smtp.mailfrom=cerebral_beach_support@proton.me;
dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=proton.me
Return-Path: <cerebral_beach_support@proton.me>
Received: from mail-4325.protonmail.ch (mail-4325.protonmail.ch. [185.70.43.25])
by mx.google.com with ESMTPS id ffacd0b85a97d-37d4b9e68fasi3126502f8f.979.2024.10.12.16.02.45
for <dylanvu9@gmail.com>
(version=TLS1_3 cipher=TLS_AES_256_GCM_SHA384 bits=256/256);
Sat, 12 Oct 2024 16:02:45 -0700 (PDT)
Received-SPF: pass (google.com: domain of cerebral_beach_support@proton.me designates 185.70.43.25 as permitted sender) client-ip=185.70.43.25;
Authentication-Results: mx.google.com;
dkim=pass header.i=@proton.me header.s=h5ksftcudnhhlftogyloqf3ec4.protonmail header.b=foX9zkdU;
spf=pass (google.com: domain of cerebral_beach_support@proton.me designates 185.70.43.25 as permitted sender) smtp.mailfrom=cerebral_beach_support@proton.me;
dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=proton.me
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=proton.me; s=h5ksftcudnhhlftogyloqf3ec4.protonmail; t=1728774164; x=1729033364; bh=+YJx1rQLvXfxJElqwwFOcwF7Mf/YPaP18tS/l+VZBHA=; h=Date:To:From:Subject:Message-ID:Feedback-ID:From:To:Cc:Date:
Subject:Reply-To:Feedback-ID:Message-ID:BIMI-Selector; b=foX9zkdULUIjedTIXEf1slXd0qmpfqzqI58YI8VqSBwML4xHgAbmYTuiJZ7VN3Ot/
Eg7GWt504jG7rD8+mp+1FvtZRmOXjDqyBJbc7cK2Vtf12n/Aj8VMwnjDcHgLgbRQvY
prynt0ctc788D7+tjTbY3iLgQRAs+Y1KqC83tLYcLDUP6O2qu/kQORyRUXdtPuf6QO
Sv+h7aXSqRi1PJnFqQ92FF/hDUu/qG5iT9QhiH0F6XXPhlV3bKv79pF653XWe32jcG
hOZnP5loQbywvhkpYGBge3hwO3adtZWI7rwyf4KiTruNJDxzbDRhGYRUGhRLIS+QFP
Sw0zMoI6jh5pg==
Date: Sat, 12 Oct 2024 23:02:39 +0000
To: "dylanvu9@gmail.com" <dylanvu9@gmail.com>
From: Cerebral Beach Hacks Support <cerebral_beach_support@proton.me>
Subject: [IMPORTANT] Your Cerebral Beach Hacks Password Has Been Reset
Message-ID: jx5XlZaqve24-0y8Xh5dE63UDKaXADZBxU-TBeWHKzo4g03yZwSioHMwFkUNwp7XSJRqnyWGoIzaADSQEZY4CMqQ1_ofzBkQrvyrapZ9HyE=@proton.me
Feedback-ID: 122855807:user:proton
X-Pm-Message-ID: 8c9c54555780422c17cffc6f9ed7016d2577c180
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="b1=_RRV34Vjl6zDxmuF5Is1kJQuDAgSihf8m61fWQJvoo"
"""