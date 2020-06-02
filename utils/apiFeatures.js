class APIFeature {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    };
    filter() {
        let queryObj = { ...this.querystr } ///create obj 
        let ExtraFeilds = ['page', 'limit', 'sort', 'feild'];
        ExtraFeilds.forEach(el => delete queryObj[el]);

        //   
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort() {
        if (this.querystr.sort) {
            const sortby = this.querystr.sort.split(',').join(' ');

            this.query = this.query.sort(sortby);



        } else {
            this.query = this.query.sort('-ratingsAverage')
        }
        return this;
    }


    feild() {
        if (this.querystr.feild) {
            const feilds = this.querystr.feild.split(',').join(' ');

            this.query = this.query.select(feilds);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    };
    limit() {
        let limit = this.querystr.limit * 1 || 100;
        let page = this.querystr.page * 1 || 1;
        let skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}

module.exports=APIFeature;