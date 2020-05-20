

const data = dataGetter();

for(const datum of data){
    const transformed = transformer(data);
    persist(transformed);
}
