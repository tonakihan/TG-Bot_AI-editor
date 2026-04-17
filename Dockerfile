FROM node:lts-alpine3.23

# Install Russian certificates
WORKDIR /usr/local/share/ca-certificates/russian
RUN wget https://gu-st.ru/content/lending/linux_russian_trusted_root_ca_pem.zip && \
    wget https://gu-st.ru/content/lending/russian_trusted_sub_ca_pem.zip && \
    unzip linux_russian_trusted_root_ca_pem.zip && \
    unzip russian_trusted_sub_ca_pem.zip && \
    rm linux_russian_trusted_root_ca_pem.zip russian_trusted_sub_ca_pem.zip && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates

# Build project
WORKDIR /usr/local/app
COPY --chown=node . .

#RUN addgroup -g 1000 node && \ 
#    adduser -u 1000 -G node -s /bin/sh -D node && \
#    chown node:node .
RUN chown node:node .
USER node

RUN yarn install -D --frozen-lockfile && \
    yarn run build && \
    rm -R node_modules src yarn.lock tsconfig.json && \
    yarn install --frozen-lockfile && \
    yarn cache clean

CMD ["npm", "start"]
