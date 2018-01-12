/*global should assert KeyOnlyPolicy KeyValuePolicy ValueOnlyPolicy TreeNode*/
(function() {

    describe('Policy tests', function() {

        it('KeyOnlyPolicy; fetch', function(done) {
            let p = new KeyOnlyPolicy();
            let n = new TreeNode();
            n.key = 'a';
            let actual = p.fetch(n);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('KeyOnlyPolicy; copy', function(done) {
            let p = new KeyOnlyPolicy();
            let nSrc = new TreeNode();
            nSrc.key = 'a';
            let nDst = new TreeNode();
            p.copy(nDst, nSrc);
            let actual = p.fetch(nDst);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('KeyOnlyPolicy; toString', function(done) {
            let p = new KeyOnlyPolicy();
            let n = new TreeNode();
            n.key = 'a';
            let actual = p.toString(n);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('KeyOnlyPolicy; toString, null key', function(done) {
            let p = new KeyOnlyPolicy();
            let n = new TreeNode();
            n.key = null;
            let actual = p.toString(n);
            let expected = 'null';
            should.equal(expected, actual);

            done();
        });

        it('KeyOnlyPolicy; toString, undefined key', function(done) {
            let p = new KeyOnlyPolicy();
            let n = new TreeNode();
            n.key = undefined;
            let actual = p.toString(n);
            let expected = 'undefined';
            should.equal(expected, actual);

            done();
        });

        it('ValueOnlyPolicy; fetch', function(done) {
            let p = new ValueOnlyPolicy();
            let n = new TreeNode();
            n.value = 'a';
            let actual = p.fetch(n);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('ValueOnlyPolicy; copy', function(done) {
            let p = new ValueOnlyPolicy();
            let nSrc = new TreeNode();
            nSrc.value = 'a';
            let nDst = new TreeNode();
            p.copy(nDst, nSrc);
            let actual = p.fetch(nDst);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('ValueOnlyPolicy; toString', function(done) {
            let p = new ValueOnlyPolicy();
            let n = new TreeNode();
            n.value = 'a';
            let actual = p.toString(n);
            let expected = 'a';
            should.equal(expected, actual);

            done();
        });

        it('ValueOnlyPolicy; toString, null value', function(done) {
            let p = new ValueOnlyPolicy();
            let n = new TreeNode();
            n.value = null;
            let actual = p.toString(n);
            let expected = 'null';
            should.equal(expected, actual);

            done();
        });

        it('ValueOnlyPolicy; toString, undefined value', function(done) {
            let p = new ValueOnlyPolicy();
            let n = new TreeNode();
            //n.value = 'a';
            let actual = p.toString(n);
            let expected = 'undefined';
            should.equal(expected, actual);

            done();
        });

        it('KeyValuePolicy; fetch', function(done) {
            let p = new KeyValuePolicy();
            let n = new TreeNode();
            n.key = 1;
            n.value = 'a';
            let actual = p.fetch(n);
            let expected = [1, 'a'];
            should.deepEqual(expected, actual);

            done();
        });

        it('KeyValuePolicy; copy', function(done) {
            let p = new KeyValuePolicy();
            let nSrc = new TreeNode();
            nSrc.key = 1;
            nSrc.value = 'a';
            let nDst = new TreeNode();
            p.copy(nDst, nSrc);
            let [actualKey, actualValue] = p.fetch(nDst);
            let [expectedKey, expectedValue] = [1, 'a'];
            should.equal(expectedKey, actualKey);
            should.equal(expectedValue, actualValue);

            done();
        });

        it('KeyValuePolicy; toString', function(done) {
            let p = new KeyValuePolicy();
            let n = new TreeNode();
            n.key = 1;
            n.value = 'a';
            let actual = p.toString(n);
            let expected = '1:a';
            should.equal(expected, actual);

            done();
        });

        it('KeyValuePolicy; toString, null key, null value', function(done) {
            let p = new KeyValuePolicy();
            let n = new TreeNode();
            n.key = null;
            n.value = null;
            let actual = p.toString(n);
            let expected = 'null:null';
            should.equal(expected, actual);

            done();
        });

        it('KeyValuePolicy; toString, undefined key, undefined value', function(done) {
            let p = new KeyValuePolicy();
            let n = new TreeNode();
            n.key = undefined;
            // n.value = null;
            let actual = p.toString(n);
            let expected = 'undefined:undefined';
            should.equal(expected, actual);

            done();
        });
    });

})();